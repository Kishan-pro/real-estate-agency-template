-- Step 6: lead history (who moved a lead when). Run in Supabase SQL Editor. Safe to re-run.

create table if not exists public.lead_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  kind text not null check (kind in ('created', 'status', 'follow_up')),
  from_value text,
  to_value text,
  created_at timestamptz not null default now()
);

create index if not exists lead_events_idx on public.lead_events (lead_id, created_at desc);

alter table public.lead_events enable row level security;

drop policy if exists "owner reads lead events" on public.lead_events;
create policy "owner reads lead events" on public.lead_events
  for select to authenticated using (true);
-- No insert/update policy on purpose: only the trigger below writes events.

-- SECURITY DEFINER so a visitor's anonymous insert can still log the "created" event.
create or replace function public.log_lead_event() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    insert into public.lead_events (lead_id, kind, to_value) values (new.id, 'created', new.status);
  else
    if new.status is distinct from old.status then
      insert into public.lead_events (lead_id, kind, from_value, to_value)
      values (new.id, 'status', old.status, new.status);
    end if;
    if new.follow_up_at is distinct from old.follow_up_at then
      insert into public.lead_events (lead_id, kind, from_value, to_value)
      values (new.id, 'follow_up', old.follow_up_at::text, new.follow_up_at::text);
    end if;
  end if;
  return new;
end $$;

drop trigger if exists leads_log_event on public.leads;
create trigger leads_log_event after insert or update on public.leads
  for each row execute function public.log_lead_event();

create index if not exists leads_follow_up_idx on public.leads (follow_up_at) where follow_up_at is not null;
