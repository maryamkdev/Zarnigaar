-- Zarnigaar: initialize a NEW, EMPTY Supabase project.
-- Paste this entire file into the new project's SQL Editor and run once as postgres.
-- Includes migrations 0001, 0002, 0003, 0005, 0006 and 0007.
-- Optional starter content: run migrations/0004_seed.sql separately, once.
-- Next: setup/02_create_admin.sql, then setup/03_verify.sql.
-- This bundle does not register Supabase CLI migration-history rows.

begin;

do $fresh_project$
begin
  if exists (
    select 1 from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname in (
        'profiles', 'admin_users', 'categories', 'collections', 'products',
        'product_images', 'collection_products', 'orders', 'order_items',
        'discounts', 'discount_usages', 'deals', 'wishlists', 'wishlist_items',
        'faqs', 'media', 'contact_messages'
      )
  ) then
    raise exception 'Application tables already exist. Use this bundle only on a new empty project; do not rerun it or drop existing data.';
  end if;
end;
$fresh_project$;

-- SOURCE: supabase/migrations/0001_schema.sql

-- Zarnigaar e-commerce schema
-- Run in the Supabase SQL editor (or via `supabase db push`) in order: 0001_schema.sql, then 0002_policies.sql, then 0003_seed.sql (optional).

create extension if not exists "pgcrypto";

-- =========================================================
-- profiles (1:1 with auth.users)
-- =========================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- explicit admin authorization table (admin routes check membership here)
create table if not exists public.admin_users (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

-- =========================================================
-- catalog
-- =========================================================
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null default '',
  price numeric(10, 2) not null check (price >= 0),
  sale_price numeric(10, 2) check (sale_price is null or sale_price >= 0),
  sku text unique not null,
  stock integer not null default 0 check (stock >= 0),
  category_id uuid references public.categories(id) on delete set null,
  sizes text[] not null default '{}',
  colors text[] not null default '{}',
  is_new boolean not null default false,
  is_featured boolean not null default false,
  is_sold_out boolean not null default false,
  status text not null default 'active' check (status in ('active', 'draft', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_id_idx on public.products(category_id);
create index if not exists products_status_idx on public.products(status);
create index if not exists products_slug_idx on public.products(slug);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  alt text not null default '',
  position integer not null default 0
);

create index if not exists product_images_product_id_idx on public.product_images(product_id);

create table if not exists public.collection_products (
  collection_id uuid not null references public.collections(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  primary key (collection_id, product_id)
);

-- =========================================================
-- orders
-- =========================================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  user_id uuid references public.profiles(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  address text not null,
  city text not null,
  province text not null,
  postal_code text not null,
  payment_method text not null check (payment_method in ('cod', 'online')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed')),
  status text not null default 'pending' check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  subtotal numeric(10, 2) not null,
  shipping numeric(10, 2) not null default 0,
  discount_total numeric(10, 2) not null default 0,
  total numeric(10, 2) not null,
  discount_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists orders_status_idx on public.orders(status);
create index if not exists orders_order_number_idx on public.orders(order_number);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  name text not null,
  image text,
  price numeric(10, 2) not null,
  size text,
  color text,
  quantity integer not null check (quantity > 0),
  line_total numeric(10, 2) not null
);

create index if not exists order_items_order_id_idx on public.order_items(order_id);

-- =========================================================
-- discounts
-- =========================================================
create table if not exists public.discounts (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  type text not null check (type in ('percentage', 'fixed')),
  value numeric(10, 2) not null check (value > 0),
  min_order numeric(10, 2) not null default 0,
  usage_limit integer,
  used_count integer not null default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  active boolean not null default true,
  applicable_product_ids uuid[] not null default '{}',
  applicable_category_ids uuid[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists discounts_code_idx on public.discounts(code);

create table if not exists public.discount_usages (
  id uuid primary key default gen_random_uuid(),
  discount_id uuid not null references public.discounts(id) on delete cascade,
  order_id uuid not null references public.orders(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  used_at timestamptz not null default now()
);

-- =========================================================
-- deals (homepage promos)
-- =========================================================
create table if not exists public.deals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text,
  cta_label text,
  cta_href text,
  starts_at timestamptz,
  ends_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- =========================================================
-- wishlists
-- =========================================================
create table if not exists public.wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  wishlist_id uuid not null references public.wishlists(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (wishlist_id, product_id)
);

-- =========================================================
-- faqs
-- =========================================================
create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text not null default 'general',
  position integer not null default 0
);

-- =========================================================
-- media (Supabase Storage reference library)
-- =========================================================
create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  path text not null,
  filename text not null,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- =========================================================
-- updated_at trigger helper
-- =========================================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at on public.profiles;
create trigger set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.categories;
create trigger set_updated_at before update on public.categories
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.collections;
create trigger set_updated_at before update on public.collections
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.products;
create trigger set_updated_at before update on public.products
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.orders;
create trigger set_updated_at before update on public.orders
  for each row execute function public.set_updated_at();

-- auto-create a profile row when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- SOURCE: supabase/migrations/0002_policies.sql

-- Row Level Security policies for Zarnigaar
-- Run after 0001_schema.sql.

-- =========================================================
-- helper: is the current user an admin?
-- =========================================================
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  ) or exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql stable security definer set search_path = public;

-- =========================================================
-- profiles
-- =========================================================
alter table public.profiles enable row level security;

create policy "profiles_select_own_or_admin" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- =========================================================
-- admin_users (admin-only, no public policy needed on client)
-- =========================================================
alter table public.admin_users enable row level security;

create policy "admin_users_select_admin_only" on public.admin_users
  for select using (public.is_admin());

-- =========================================================
-- categories / collections / collection_products (public read, admin write)
-- =========================================================
alter table public.categories enable row level security;
create policy "categories_public_read" on public.categories for select using (true);
create policy "categories_admin_write" on public.categories for all
  using (public.is_admin()) with check (public.is_admin());

alter table public.collections enable row level security;
create policy "collections_public_read" on public.collections for select using (true);
create policy "collections_admin_write" on public.collections for all
  using (public.is_admin()) with check (public.is_admin());

alter table public.collection_products enable row level security;
create policy "collection_products_public_read" on public.collection_products for select using (true);
create policy "collection_products_admin_write" on public.collection_products for all
  using (public.is_admin()) with check (public.is_admin());

-- =========================================================
-- products / product_images (public read of active products, admin write)
-- =========================================================
alter table public.products enable row level security;
create policy "products_public_read" on public.products
  for select using (status = 'active' or public.is_admin());
create policy "products_admin_write" on public.products for all
  using (public.is_admin()) with check (public.is_admin());

alter table public.product_images enable row level security;
create policy "product_images_public_read" on public.product_images for select using (true);
create policy "product_images_admin_write" on public.product_images for all
  using (public.is_admin()) with check (public.is_admin());

-- =========================================================
-- orders / order_items (owner or admin; inserts happen via server actions
-- using the service role, so no public insert policy is granted here)
-- =========================================================
alter table public.orders enable row level security;
create policy "orders_select_owner_or_admin" on public.orders
  for select using (auth.uid() = user_id or public.is_admin());
create policy "orders_admin_update" on public.orders
  for update using (public.is_admin()) with check (public.is_admin());

alter table public.order_items enable row level security;
create policy "order_items_select_owner_or_admin" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())
    )
  );

-- =========================================================
-- discounts (admin manages; validation of a code happens via server action
-- using the service role, so no public select policy is granted here)
-- =========================================================
alter table public.discounts enable row level security;
create policy "discounts_admin_all" on public.discounts for all
  using (public.is_admin()) with check (public.is_admin());

alter table public.discount_usages enable row level security;
create policy "discount_usages_admin_read" on public.discount_usages
  for select using (public.is_admin() or auth.uid() = user_id);

-- =========================================================
-- deals (public read of active deals, admin write)
-- =========================================================
alter table public.deals enable row level security;
create policy "deals_public_read" on public.deals
  for select using (active = true or public.is_admin());
create policy "deals_admin_write" on public.deals for all
  using (public.is_admin()) with check (public.is_admin());

-- =========================================================
-- wishlists / wishlist_items (owner only)
-- =========================================================
alter table public.wishlists enable row level security;
create policy "wishlists_owner_all" on public.wishlists for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.wishlist_items enable row level security;
create policy "wishlist_items_owner_all" on public.wishlist_items for all
  using (
    exists (select 1 from public.wishlists w where w.id = wishlist_id and w.user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.wishlists w where w.id = wishlist_id and w.user_id = auth.uid())
  );

-- =========================================================
-- faqs (public read, admin write)
-- =========================================================
alter table public.faqs enable row level security;
create policy "faqs_public_read" on public.faqs for select using (true);
create policy "faqs_admin_write" on public.faqs for all
  using (public.is_admin()) with check (public.is_admin());

-- =========================================================
-- media (admin only)
-- =========================================================
alter table public.media enable row level security;
create policy "media_admin_all" on public.media for all
  using (public.is_admin()) with check (public.is_admin());

-- SOURCE: supabase/migrations/0003_storage.sql

-- Storage bucket + policies for product/media images.
-- Run after 0002_policies.sql.

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media_bucket_public_read"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "media_bucket_admin_write"
  on storage.objects for insert
  with check (bucket_id = 'media' and public.is_admin());

create policy "media_bucket_admin_update"
  on storage.objects for update
  using (bucket_id = 'media' and public.is_admin());

create policy "media_bucket_admin_delete"
  on storage.objects for delete
  using (bucket_id = 'media' and public.is_admin());

-- SOURCE: supabase/migrations/0005_contact_messages.sql

-- Contact form submissions (Contact page). Run after 0002_policies.sql.

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

-- Inserts happen via a server action using the service-role client, so no
-- public insert policy is needed. Only admins can read submissions.
create policy "contact_messages_admin_read" on public.contact_messages
  for select using (public.is_admin());

-- SOURCE: supabase/migrations/0006_article_details.sql

-- Optional article content, editable only through existing product admin policies.
alter table public.products
  add column if not exists fabric_details text,
  add column if not exists additional_details text,
  add column if not exists care_instructions text,
  add column if not exists design_philosophy text;

-- SOURCE: supabase/migrations/0007_api_permissions.sql

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

commit;
