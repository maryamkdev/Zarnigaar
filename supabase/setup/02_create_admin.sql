-- First create your own account through /login or Supabase Authentication > Users.
-- Replace the email below, then run this entire file in the Supabase SQL Editor.
-- This promotes an EXISTING account; it does not create a password or user.

begin;

do $admin_setup$
declare
  admin_email text := 'REPLACE_WITH_YOUR_ADMIN_EMAIL';
  admin_id uuid;
  matching_accounts integer;
begin
  if position('@' in admin_email) = 0 then
    raise exception 'Replace REPLACE_WITH_YOUR_ADMIN_EMAIL with your actual account email.';
  end if;

  select count(*) into matching_accounts
  from auth.users
  where lower(email) = lower(trim(admin_email));

  if matching_accounts <> 1 then
    raise exception 'Expected exactly one registered account for %, found %. Create the account first.',
      admin_email, matching_accounts;
  end if;

  select id into strict admin_id
  from auth.users
  where lower(email) = lower(trim(admin_email));

  insert into public.profiles (id, full_name, role)
  select id, raw_user_meta_data->>'full_name', 'admin'
  from auth.users where id = admin_id
  on conflict (id) do update set role = 'admin';

  -- The app checks profiles.role; database policies also support admin_users.
  insert into public.admin_users (user_id, role)
  values (admin_id, 'admin')
  on conflict (user_id) do update set role = 'admin';
end;
$admin_setup$;

commit;

select u.id, u.email, u.email_confirmed_at, p.role,
  exists (select 1 from public.admin_users a where a.user_id = u.id) as admin_membership
from auth.users u
join public.profiles p on p.id = u.id
where p.role = 'admin';
