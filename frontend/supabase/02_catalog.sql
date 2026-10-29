-- Step 2: properties, images, testimonials, site settings, storage.
-- Run in Supabase Dashboard -> SQL Editor (after schema.sql). Safe to re-run.

-- ---------- properties ----------
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  title text not null check (char_length(title) between 3 and 150),
  locality text not null,
  type text not null check (type in ('apartment', 'house', 'villa', 'plot', 'commercial')),
  bhk int check (bhk between 1 and 10),
  size_sqft int check (size_sqft > 0),
  price_inr bigint not null check (price_inr > 0),
  description text,
  amenities text[] not null default '{}',
  map_link text,
  status text not null default 'available' check (status in ('available', 'hold', 'sold')),
  featured boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists properties_listing_idx on public.properties (published, created_at desc);

create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists properties_touch on public.properties;
create trigger properties_touch before update on public.properties
  for each row execute function public.touch_updated_at();

-- ---------- images ----------
create table if not exists public.property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  path text not null,            -- storage path inside the property-images bucket
  position int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists property_images_idx on public.property_images (property_id, position);

-- ---------- testimonials ----------
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  locality text,
  rating int not null default 5 check (rating between 1 and 5),
  body text not null,
  published boolean not null default true,
  position int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- single-row site settings ----------
create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  phone text not null default '8310216700',
  whatsapp text not null default '8310216700',
  email text,
  address text,
  owner_name text not null default 'Kishan',
  owner_photo_path text,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id) values (1) on conflict do nothing;

-- ---------- leads: link an enquiry to a property + follow-up date ----------
alter table public.leads add column if not exists property_id uuid references public.properties(id) on delete set null;
alter table public.leads add column if not exists follow_up_at timestamptz;

-- ---------- row-level security ----------
alter table public.properties enable row level security;
alter table public.property_images enable row level security;
alter table public.testimonials enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "public reads published properties" on public.properties;
create policy "public reads published properties" on public.properties
  for select to anon, authenticated using (published or auth.role() = 'authenticated');

drop policy if exists "owner writes properties" on public.properties;
create policy "owner writes properties" on public.properties
  for all to authenticated using (true) with check (true);

drop policy if exists "public reads images of published properties" on public.property_images;
create policy "public reads images of published properties" on public.property_images
  for select to anon, authenticated using (
    auth.role() = 'authenticated'
    or exists (select 1 from public.properties p where p.id = property_id and p.published)
  );

drop policy if exists "owner writes images" on public.property_images;
create policy "owner writes images" on public.property_images
  for all to authenticated using (true) with check (true);

drop policy if exists "public reads published testimonials" on public.testimonials;
create policy "public reads published testimonials" on public.testimonials
  for select to anon, authenticated using (published or auth.role() = 'authenticated');

drop policy if exists "owner writes testimonials" on public.testimonials;
create policy "owner writes testimonials" on public.testimonials
  for all to authenticated using (true) with check (true);

drop policy if exists "public reads settings" on public.site_settings;
create policy "public reads settings" on public.site_settings
  for select to anon, authenticated using (true);

drop policy if exists "owner updates settings" on public.site_settings;
create policy "owner updates settings" on public.site_settings
  for update to authenticated using (true) with check (true);

-- Lead insert policy: allow a property_id on a new enquiry (signed-in or not).
drop policy if exists "public can submit leads" on public.leads;
create policy "public can submit leads" on public.leads
  for insert to anon, authenticated
  with check (status = 'new' and notes is null and follow_up_at is null);

-- ---------- storage ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('property-images', 'property-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = true, file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

drop policy if exists "owner uploads images" on storage.objects;
create policy "owner uploads images" on storage.objects
  for insert to authenticated with check (bucket_id = 'property-images');

-- Upserts (replace-if-exists) also need the owner to be able to read objects.
drop policy if exists "owner reads images" on storage.objects;
create policy "owner reads images" on storage.objects
  for select to authenticated using (bucket_id = 'property-images');

drop policy if exists "owner updates images" on storage.objects;
create policy "owner updates images" on storage.objects
  for update to authenticated using (bucket_id = 'property-images');

drop policy if exists "owner deletes images" on storage.objects;
create policy "owner deletes images" on storage.objects
  for delete to authenticated using (bucket_id = 'property-images');
-- Reads need no policy: the bucket is public, so image URLs work directly.
