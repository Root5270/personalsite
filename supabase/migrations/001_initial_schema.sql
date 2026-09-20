create extension if not exists pgcrypto;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  title text not null check (char_length(title) between 1 and 120),
  category text not null default '',
  role text not null default '',
  year text not null default '',
  summary text not null default '',
  sections jsonb not null default '[]'::jsonb,
  images jsonb not null default '[]'::jsonb,
  tags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 60),
  email text not null check (char_length(email) <= 254),
  content text not null check (char_length(content) between 10 and 3000),
  status text not null default 'unread' check (status in ('unread', 'processing', 'done', 'spam')),
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;
alter table public.messages enable row level security;

revoke all on public.projects from anon, authenticated;
revoke all on public.messages from anon, authenticated;
grant select on public.projects to anon, authenticated;

drop policy if exists "published projects are public" on public.projects;
create policy "published projects are public"
on public.projects for select
to anon, authenticated
using (status = 'published');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

create index if not exists projects_status_sort_idx on public.projects(status, sort_order);
create index if not exists messages_status_created_idx on public.messages(status, created_at desc);
