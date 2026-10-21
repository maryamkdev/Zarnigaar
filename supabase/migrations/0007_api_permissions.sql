-- Explicit API permissions for new Supabase projects.
-- Run after 0001, 0002, 0003, 0005 and 0006. Starter data (0004) is optional.
-- RLS policies still decide which rows each signed-in user may access.

grant usage on schema public to anon, authenticated, service_role;

-- Avoid depending on a project's automatic grants. In particular, RLS
-- does not protect against TRUNCATE or prevent changing a permitted row's role.
revoke all privileges on table
  public.profiles, public.admin_users, public.categories, public.collections,
  public.products, public.product_images, public.collection_products,
  public.orders, public.order_items, public.discounts, public.discount_usages,
  public.deals, public.wishlists, public.wishlist_items, public.faqs,
  public.media, public.contact_messages
from public, anon, authenticated;

grant select on table
  public.categories, public.collections, public.products,
  public.product_images, public.collection_products, public.deals, public.faqs
to anon;

grant select on table
  public.profiles, public.admin_users, public.categories, public.collections,
  public.products, public.product_images, public.collection_products,
  public.orders, public.order_items, public.discounts, public.discount_usages,
  public.deals, public.wishlists, public.wishlist_items, public.faqs,
  public.media, public.contact_messages
to authenticated;

grant insert, update, delete on table
  public.categories, public.collections, public.products,
  public.product_images, public.collection_products, public.discounts,
  public.deals, public.faqs, public.media,
  public.wishlists, public.wishlist_items
to authenticated;

grant update on table public.orders to authenticated;

-- A customer may edit contact details, but cannot promote their own role.
-- Signup's SECURITY DEFINER trigger creates profiles; clients need no INSERT.
drop policy if exists "profiles_insert_own" on public.profiles;
revoke insert (id, full_name, phone, role, created_at, updated_at),
  update (id, full_name, phone, role, created_at, updated_at)
on table public.profiles from public, anon, authenticated;
grant update (full_name, phone) on table public.profiles to authenticated;

-- Required for guest checkout, coupon checks, contact messages and customers.
grant all privileges on table
  public.profiles, public.admin_users, public.categories, public.collections,
  public.products, public.product_images, public.collection_products,
  public.orders, public.order_items, public.discounts, public.discount_usages,
  public.deals, public.wishlists, public.wishlist_items, public.faqs,
  public.media, public.contact_messages
to service_role;

grant execute on function public.is_admin() to anon, authenticated, service_role;

-- Cover accounts created in Authentication before these tables were installed.
insert into public.profiles (id, full_name, created_at)
select id, raw_user_meta_data->>'full_name', created_at
from auth.users
on conflict (id) do nothing;

notify pgrst, 'reload schema';
