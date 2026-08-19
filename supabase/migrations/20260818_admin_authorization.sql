-- Admin authorization migration. Run after 20260818_gallery.sql.
-- This never stores an admin password; that belongs only in Supabase Auth.
alter table public.admin_users add column if not exists id uuid default gen_random_uuid();
alter table public.admin_users add column if not exists email text;
update public.admin_users au set email = u.email
from auth.users u where u.id = au.user_id and au.email is null;
alter table public.admin_users alter column email set not null;
create unique index if not exists admin_users_email_key on public.admin_users (lower(email));

-- This function is safe to call from the browser: it returns only a boolean for
-- the current JWT subject. It does not reveal the admin table's contents.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;
grant execute on function public.is_admin() to anon, authenticated;

-- Do not allow clients to enumerate admin users. The owner check is made through
-- the secure function above, and the policies below protect all managed data.
drop policy if exists "admins can view themselves" on public.admin_users;
create policy "admins can view their own record"
on public.admin_users for select to authenticated
using (user_id = auth.uid());

-- Create the single initial owner after creating this user in Supabase Auth:
-- insert into public.admin_users (user_id, email)
-- values ('AUTH_USER_UUID_FOR_greenhillstudio13@gmail.com', 'greenhillstudio13@gmail.com');
