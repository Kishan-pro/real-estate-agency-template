-- Anonymous view tracking. Run in Supabase SQL Editor. Safe to re-run.
-- A visitor gets a random ID stored in their own browser (no name, no sign-up).
-- If they later submit an enquiry, that ID is saved on the lead so the owner can see what they looked at.

create table if not exists public.property_views (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  visitor_id text not null check (char_length(visitor_id) between 8 and 64),
  created_at timestamptz not null default now()
);

create index if not exists property_views_property_idx on public.property_views (property_id, created_at desc);
create index if not exists property_views_visitor_idx on public.property_views (visitor_id);
create index if not exists property_views_created_idx on public.property_views (created_at desc);

alter table public.leads add column if not exists visitor_id text check (visitor_id is null or char_length(visitor_id) between 8 and 64);
create index if not exists leads_visitor_idx on public.leads (visitor_id) where visitor_id is not null;

alter table public.property_views enable row level security;

-- Visitors may only ADD a view for a property that is published. They can never read views.
drop policy if exists "public can log views" on public.property_views;
create policy "public can log views" on public.property_views
  for insert to anon, authenticated
  with check (exists (select 1 from public.properties p where p.id = property_id and p.published));

drop policy if exists "owner reads views" on public.property_views;
create policy "owner reads views" on public.property_views
  for select to authenticated using (true);

drop policy if exists "owner deletes views" on public.property_views;
create policy "owner deletes views" on public.property_views
  for delete to authenticated using (true);
