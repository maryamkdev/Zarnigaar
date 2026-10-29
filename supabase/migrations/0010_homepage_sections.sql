-- Persistent homepage visibility. Default placeholder tiles are hidden.
create table if not exists public.homepage_sections (
  section_id text primary key check (section_id in (
    'hero', 'scarves', 'our_articles', 'scarves_promotion',
    'clothing_promotion', 'accessories_promotion', 'deals'
  )),
  enabled boolean not null default false,
  updated_at timestamptz not null default now()
);

insert into public.homepage_sections (section_id, enabled) values
  ('hero', true), ('scarves', true), ('our_articles', true),
  ('scarves_promotion', false), ('clothing_promotion', false),
  ('accessories_promotion', false), ('deals', true)
on conflict (section_id) do nothing;

drop trigger if exists set_updated_at on public.homepage_sections;
create trigger set_updated_at before update on public.homepage_sections
  for each row execute function public.set_updated_at();

alter table public.homepage_sections enable row level security;
drop policy if exists homepage_sections_public_read on public.homepage_sections;
create policy homepage_sections_public_read on public.homepage_sections
  for select to anon, authenticated using (true);
drop policy if exists homepage_sections_admin_update on public.homepage_sections;
create policy homepage_sections_admin_update on public.homepage_sections
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

revoke all privileges on public.homepage_sections from public, anon, authenticated;
revoke insert (section_id, enabled, updated_at), update (section_id, enabled, updated_at)
  on public.homepage_sections from public, anon, authenticated;
grant select on public.homepage_sections to anon, authenticated;
grant update (enabled) on public.homepage_sections to authenticated;
grant all privileges on public.homepage_sections to service_role;
notify pgrst, 'reload schema';
