-- CMS persistence for Vercel (run in Supabase SQL Editor)
-- Media table may already exist from supabase/media.sql

-- Key/value JSON documents: settings, homepage, gallery, pages, subpages, seo-pages, translations
create table if not exists public.cms_docs (
  key text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create or replace function public.touch_cms_docs_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists cms_docs_touch on public.cms_docs;
create trigger cms_docs_touch
  before update on public.cms_docs
  for each row execute function public.touch_cms_docs_updated_at();

-- News posts (one row per article; full payload in data)
create table if not exists public.news_posts (
  id bigint primary key,
  slug text not null unique,
  published boolean not null default true,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists news_posts_updated_at_idx on public.news_posts (updated_at desc);
create index if not exists news_posts_published_idx on public.news_posts (published);

drop trigger if exists news_posts_touch on public.news_posts;
create trigger news_posts_touch
  before update on public.news_posts
  for each row execute function public.touch_cms_docs_updated_at();

-- Contact / quote submissions
create table if not exists public.submissions (
  id bigint primary key,
  created_at timestamptz not null default now(),
  data jsonb not null default '{}'::jsonb
);

create index if not exists submissions_created_at_idx on public.submissions (created_at desc);

-- RLS: public read for live site; writes via service_role only
alter table public.cms_docs enable row level security;
alter table public.news_posts enable row level security;
alter table public.submissions enable row level security;

drop policy if exists "cms_docs_public_read" on public.cms_docs;
create policy "cms_docs_public_read"
  on public.cms_docs for select using (true);

drop policy if exists "news_posts_public_read" on public.news_posts;
create policy "news_posts_public_read"
  on public.news_posts for select using (published = true);

-- Submissions: no public read (PII)
drop policy if exists "submissions_no_public" on public.submissions;

-- media table (safe if already created)
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

alter table public.media enable row level security;
drop policy if exists "media_public_read" on public.media;
create policy "media_public_read"
  on public.media for select using (true);
