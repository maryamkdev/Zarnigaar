-- Read-only checks. Run after unified_migrations.sql (or 01_initialize.sql)
-- and 02_create_admin.sql.
-- Run in Supabase SQL Editor; dashboard execution itself bypasses user RLS.
-- These checks do not replace browser testing as a customer and an admin.

-- 1. Every row must show table_exists=true, rls_enabled=true, has_policies=true.
with expected(table_name) as (values
  ('profiles'), ('admin_users'), ('categories'), ('collections'), ('products'),
  ('product_images'), ('collection_products'), ('orders'), ('order_items'),
  ('discounts'), ('discount_usages'), ('deals'), ('wishlists'), ('wishlist_items'),
  ('faqs'), ('media'), ('contact_messages'), ('product_reviews'), ('homepage_sections')
)
select e.table_name, c.oid is not null as table_exists,
  coalesce(c.relrowsecurity, false) as rls_enabled,
  exists (select 1 from pg_policies p
    where p.schemaname = 'public' and p.tablename = e.table_name) as has_policies
from expected e
left join pg_namespace n on n.nspname = 'public'
left join pg_class c on c.relnamespace = n.oid
  and c.relname = e.table_name and c.relkind = 'r'
order by e.table_name;

-- 2. Four rows, each with column_exists=true.
with expected(column_name) as (values
  ('fabric_details'), ('additional_details'), ('care_instructions'), ('design_philosophy')
)
select e.column_name, exists (
  select 1 from information_schema.columns c
  where c.table_schema = 'public' and c.table_name = 'products'
    and c.column_name = e.column_name
) as column_exists
from expected e;

-- 3. One row with id=media, name=media, public=true.
select id, name, public from storage.buckets where id = 'media';

-- 4. Four storage policies (SELECT, INSERT, UPDATE, DELETE).
select policyname, cmd, qual, with_check
from pg_policies
where schemaname = 'storage' and tablename = 'objects'
  and policyname in ('media_bucket_public_read', 'media_bucket_admin_write',
    'media_bucket_admin_update', 'media_bucket_admin_delete')
order by policyname;

-- 5. One enabled signup trigger (enabled=O).
select tgname, tgenabled as enabled
from pg_trigger
where tgrelid = 'auth.users'::regclass
  and tgname = 'on_auth_user_created' and not tgisinternal;

-- 6. All values should be true. Role assignment stays in trusted SQL/server code.
select
  not has_column_privilege('authenticated', 'public.profiles', 'role', 'UPDATE')
    as customer_cannot_change_role,
  not has_column_privilege('authenticated', 'public.profiles', 'role', 'INSERT')
    as customer_cannot_insert_role,
  has_column_privilege('authenticated', 'public.profiles', 'full_name', 'UPDATE')
    as customer_can_edit_name,
  has_table_privilege('anon', 'public.products', 'SELECT') as public_can_query_products,
  not has_table_privilege('anon', 'public.orders', 'SELECT') as guest_cannot_read_orders,
  has_table_privilege('service_role', 'public.orders', 'INSERT') as server_can_create_orders,
  has_table_privilege('service_role', 'public.contact_messages', 'INSERT') as server_can_save_contacts,
  exists (select 1 from pg_roles where rolname = 'service_role' and rolbypassrls)
    as service_role_bypasses_rls;

-- 7. At least one confirmed admin account with admin_membership=true.
select u.id, u.email, u.email_confirmed_at, p.role,
  exists (select 1 from public.admin_users a where a.user_id = u.id) as admin_membership
from auth.users u
join public.profiles p on p.id = u.id
where p.role = 'admin';

-- 8. Must return zero rows: accounts without a profile.
select u.id, u.email from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;

-- 9. Counts can be zero until you add content; active products appear in the shop.
select
  (select count(*) from public.categories) as categories,
  (select count(*) from public.products) as products,
  (select count(*) from public.products where status = 'active') as active_products,
  (select count(*) from public.product_images) as product_images,
  (select count(*) from public.orders) as orders,
  (select count(*) from public.contact_messages) as contact_messages,
  (select count(*) from public.product_reviews) as product_reviews;

-- 10. Review summary view must respect underlying table RLS.
select relname, reloptions from pg_class
where oid = 'public.product_rating_summaries'::regclass;

-- 11. All review write restrictions should be true.
select
  not has_table_privilege('anon', 'public.product_reviews', 'INSERT') as guests_cannot_post,
  has_column_privilege('authenticated', 'public.product_reviews', 'rating', 'INSERT') as customers_can_rate,
  not has_column_privilege('authenticated', 'public.product_reviews', 'user_id', 'INSERT') as customers_cannot_forge_author,
  not has_column_privilege('authenticated', 'public.product_reviews', 'product_id', 'UPDATE') as reviews_cannot_move_products;

-- 12. Seven homepage controls. Promotion tiles start false; saved choices may differ.
select section_id, enabled, updated_at from public.homepage_sections order by section_id;

-- 13. Homepage visibility grants: all values should be true (RLS limits updates to admins).
select
  has_table_privilege('anon', 'public.homepage_sections', 'SELECT') as public_can_read_visibility,
  not has_table_privilege('anon', 'public.homepage_sections', 'UPDATE') as guests_cannot_change_visibility,
  has_column_privilege('authenticated', 'public.homepage_sections', 'enabled', 'UPDATE') as signed_in_role_can_reach_update_policy,
  not has_column_privilege('authenticated', 'public.homepage_sections', 'section_id', 'UPDATE') as section_identifiers_are_protected;
