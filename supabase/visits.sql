-- Run in Supabase SQL Editor if visits table is missing
create table if not exists public.visits (
  id bigint primary key,
  created_at timestamptz not null default now(),
  data jsonb not null default '{}'::jsonb
);

create index if not exists visits_created_at_idx on public.visits (created_at desc);

alter table public.visits enable row level security;
drop policy if exists "visits_no_public" on public.visits;
