-- Run this in the Supabase SQL editor. Create the first owner in Auth, then insert their id in admin_users.
create table if not exists public.admin_users (user_id uuid primary key references auth.users(id) on delete cascade, created_at timestamptz not null default now());
create table if not exists public.gallery_images (
 id uuid primary key default gen_random_uuid(), title text not null check (char_length(title) between 1 and 160), description text, category text not null, image_url text not null, storage_path text not null unique, is_active boolean not null default true, display_order integer not null default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists gallery_images_public_idx on public.gallery_images (category, display_order, created_at desc) where is_active=true;
alter table public.admin_users enable row level security; alter table public.gallery_images enable row level security;
create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$select exists(select 1 from public.admin_users where user_id=auth.uid())$$;
create policy "public reads active images" on public.gallery_images for select using (is_active or public.is_admin());
create policy "admins manage images" on public.gallery_images for all using (public.is_admin()) with check (public.is_admin());
-- In Storage: create a public bucket named gallery-images, then run policies below.
create policy "public reads gallery files" on storage.objects for select using (bucket_id='gallery-images');
create policy "admins upload gallery files" on storage.objects for insert with check (bucket_id='gallery-images' and public.is_admin());
create policy "admins update gallery files" on storage.objects for update using (bucket_id='gallery-images' and public.is_admin());
create policy "admins delete gallery files" on storage.objects for delete using (bucket_id='gallery-images' and public.is_admin());
