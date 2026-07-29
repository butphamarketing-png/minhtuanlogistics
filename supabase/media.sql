-- Run once in Supabase SQL Editor (Dashboard → SQL → New query)
-- Table for admin media library metadata (files live on Cloudflare R2)

create table if not exists public.media (
  id text primary key,
  name text not null,
  url text not null,
  key text,
  size bigint not null default 0,
  alt text not null default '',
  storage text not null default 'r2',
  uploaded_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists media_uploaded_at_idx on public.media (uploaded_at desc);
create index if not exists media_key_idx on public.media (key);

alter table public.media enable row level security;

-- Public read (optional — images are served from R2 public URL anyway)
drop policy if exists "media_public_read" on public.media;
create policy "media_public_read"
  on public.media for select
  using (true);

-- Writes only via service_role (bypasses RLS). No insert/update/delete policies for anon.
