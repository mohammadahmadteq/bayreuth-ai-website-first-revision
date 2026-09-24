create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade
);

create table public.partners (
  id text primary key,
  name text not null,
  logo_url text not null,
  website_url text,
  tier text not null check (tier in ('sponsor', 'cooperation')),
  description text,
  sort_order integer not null default 0
);

create table public.team_members (
  id text primary key,
  name text not null,
  role text not null,
  bio text not null default '',
  image_url text not null,
  linkedin text,
  is_board_member boolean not null default false,
  sort_order integer not null default 0
);

create table public.events (
  id text primary key,
  title text not null,
  description text not null default '',
  date date not null,
  time text not null,
  location text not null,
  category text not null check (category in ('talk', 'dinner', 'workshop', 'social')),
  is_featured boolean not null default false,
  sort_order integer not null default 0
);

create table public.association_photos (
  id text primary key,
  image_url text not null,
  alt text not null,
  sort_order integer not null default 0
);

alter table public.admin_users enable row level security;
alter table public.partners enable row level security;
alter table public.team_members enable row level security;
alter table public.events enable row level security;
alter table public.association_photos enable row level security;

grant select on public.admin_users to authenticated;
create policy "Admins can identify themselves" on public.admin_users
  for select to authenticated using (user_id = (select auth.uid()));

do $$
declare content_table text;
begin
  foreach content_table in array array['partners', 'team_members', 'events', 'association_photos'] loop
    execute format('grant select on public.%I to anon, authenticated', content_table);
    execute format('grant insert, update, delete on public.%I to authenticated', content_table);
    execute format('create policy "Public can read" on public.%I for select to anon, authenticated using (true)', content_table);
    execute format('create policy "Admins can insert" on public.%I for insert to authenticated with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())))', content_table);
    execute format('create policy "Admins can update" on public.%I for update to authenticated using (exists (select 1 from public.admin_users where user_id = (select auth.uid()))) with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())))', content_table);
    execute format('create policy "Admins can delete" on public.%I for delete to authenticated using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))', content_table);
  end loop;
end $$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-images', 'site-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do nothing;

create policy "Admins can inspect site images" on storage.objects
  for select to authenticated using (bucket_id = 'site-images' and exists (select 1 from public.admin_users where user_id = (select auth.uid())));
create policy "Admins can upload site images" on storage.objects
  for insert to authenticated with check (bucket_id = 'site-images' and exists (select 1 from public.admin_users where user_id = (select auth.uid())));
create policy "Admins can replace site images" on storage.objects
  for update to authenticated using (bucket_id = 'site-images' and exists (select 1 from public.admin_users where user_id = (select auth.uid())))
  with check (bucket_id = 'site-images' and exists (select 1 from public.admin_users where user_id = (select auth.uid())));
create policy "Admins can remove site images" on storage.objects
  for delete to authenticated using (bucket_id = 'site-images' and exists (select 1 from public.admin_users where user_id = (select auth.uid())));
