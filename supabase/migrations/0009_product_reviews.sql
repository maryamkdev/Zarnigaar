-- Real customer feedback: one review per signed-in account per product.
create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  author_name text not null default 'Customer',
  rating smallint not null check (rating between 1 and 5),
  body text not null check (char_length(body) between 1 and 2000 and body ~ '[^[:space:]]'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, user_id)
);
create index if not exists product_reviews_product_date_idx
  on public.product_reviews(product_id, created_at desc, id desc);
create index if not exists product_reviews_user_idx on public.product_reviews(user_id);

-- Public names come from the account profile, never from a submitted email/name.
create or replace function public.set_review_author()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    select coalesce(nullif(left(btrim(full_name), 80), ''), 'Customer')
      into new.author_name from public.profiles where id = new.user_id;
    new.author_name = coalesce(new.author_name, 'Customer');
  end if;
  new.updated_at = now();
  return new;
end;
$$;
revoke all on function public.set_review_author() from public, anon, authenticated;
drop trigger if exists set_review_author on public.product_reviews;
create trigger set_review_author before insert or update on public.product_reviews
  for each row execute function public.set_review_author();

alter table public.product_reviews enable row level security;
drop policy if exists reviews_public_read on public.product_reviews;
create policy reviews_public_read on public.product_reviews for select to anon, authenticated
  using (exists (select 1 from public.products p where p.id = product_id and p.status = 'active'));
drop policy if exists reviews_owner_insert on public.product_reviews;
create policy reviews_owner_insert on public.product_reviews for insert to authenticated
  with check ((select auth.uid()) = user_id and exists (
    select 1 from public.products p where p.id = product_id and p.status = 'active'
  ));
drop policy if exists reviews_owner_update on public.product_reviews;
create policy reviews_owner_update on public.product_reviews for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id and exists (
    select 1 from public.products p where p.id = product_id and p.status = 'active'
  ));
drop policy if exists reviews_owner_delete on public.product_reviews;
create policy reviews_owner_delete on public.product_reviews for delete to authenticated
  using ((select auth.uid()) = user_id or public.is_admin());

revoke all privileges on public.product_reviews from public, anon, authenticated;
grant select on public.product_reviews to anon, authenticated;
grant insert (product_id, rating, body) on public.product_reviews to authenticated;
grant update (rating, body) on public.product_reviews to authenticated;
grant delete on public.product_reviews to authenticated;
grant all privileges on public.product_reviews to service_role;

-- Batch averages/counts for product cards without exposing private profile data.
create or replace view public.product_rating_summaries with (security_invoker = true) as
  select product_id, round(avg(rating), 2) as average_rating, count(*)::integer as review_count
  from public.product_reviews group by product_id;
revoke all privileges on public.product_rating_summaries from public, anon, authenticated;
grant select on public.product_rating_summaries to anon, authenticated, service_role;
notify pgrst, 'reload schema';
