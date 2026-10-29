-- Run in Supabase Dashboard -> SQL Editor.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  phone text not null check (char_length(phone) between 10 and 20),
  looking_for text not null check (char_length(looking_for) <= 100),
  whatsapp_updates boolean not null default false,
  source text not null default 'form',
  utm_source text,
  utm_medium text,
  utm_campaign text,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'visit', 'closed', 'lost')),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);

alter table public.leads enable row level security;

-- Visitors can only INSERT a new lead (status is forced to 'new').
create policy "public can submit leads" on public.leads
  for insert to anon, authenticated
  with check (status = 'new' and notes is null);

-- Only the signed-in owner can read / update / delete.
-- Create the owner under Authentication -> Users, then disable public sign-ups
-- (Authentication -> Providers -> Email -> turn off "Allow new users to sign up").
create policy "owner reads leads" on public.leads
  for select to authenticated using (true);
create policy "owner updates leads" on public.leads
  for update to authenticated using (true) with check (true);
create policy "owner deletes leads" on public.leads
  for delete to authenticated using (true);
alter publication supabase_realtime add table public.leads;
