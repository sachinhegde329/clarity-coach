create extension if not exists "pgcrypto";

create type public.plan_tier as enum ('free', 'premium');
create type public.session_bucket as enum ('open', 'constraint', 'comparative', 'reactive', 'adversarial', 'review');
create type public.attempt_status as enum ('recorded', 'transcribed', 'analysed', 'failed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  industry text,
  role text,
  goal text,
  frictions text[] not null default '{}',
  audience text,
  pressure_pattern text,
  daily_minutes integer not null default 5,
  practice_time text,
  locale text not null default 'en',
  accent_notes text,
  plan public.plan_tier not null default 'free'
);

create table public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source text not null default 'revenuecat',
  entitlement_id text not null,
  product_id text,
  is_active boolean not null default false,
  expires_at timestamptz,
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, entitlement_id)
);

create table public.session_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id integer not null check (session_id between 1 and 36),
  sprint_id integer not null check (sprint_id between 1 and 6),
  bucket public.session_bucket not null,
  status public.attempt_status not null default 'recorded',
  recording_path text,
  duration_ms integer,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.transcripts (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.session_attempts(id) on delete cascade,
  provider text not null,
  language text not null default 'en',
  text text not null,
  segments jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table public.session_metrics (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.session_attempts(id) on delete cascade,
  key text not null,
  label text not null,
  value numeric,
  value_text text,
  unit text,
  delta text,
  created_at timestamptz not null default now()
);

create table public.ai_critiques (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid references public.session_attempts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id integer not null check (session_id between 1 and 36),
  provider text not null,
  model text not null,
  critique text not null,
  recommendation text not null,
  suggested_commitment text,
  annotations jsonb not null default '[]'::jsonb,
  input_tokens integer,
  output_tokens integer,
  created_at timestamptz not null default now()
);

create table public.commitments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id integer not null check (session_id between 1 and 36),
  recording_path text,
  transcript text,
  created_at timestamptz not null default now(),
  unique (user_id, session_id)
);

create table public.badges (
  id text primary key,
  title text not null,
  description text not null
);

create table public.user_badges (
  user_id uuid not null references auth.users(id) on delete cascade,
  badge_id text not null references public.badges(id) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);

create table public.prompt_usage_limits (
  user_id uuid not null references auth.users(id) on delete cascade,
  month date not null,
  cloud_transcriptions_used integer not null default 0,
  ai_critiques_used integer not null default 0,
  primary key (user_id, month)
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('recordings', 'recordings', false, 52428800, array['audio/m4a', 'audio/mp4', 'audio/wav', 'audio/webm', 'audio/aac']),
  ('reference-audio', 'reference-audio', false, 52428800, array['audio/m4a', 'audio/mp4', 'audio/wav', 'audio/aac']),
  ('share-clips', 'share-clips', false, 104857600, array['video/mp4', 'image/png'])
on conflict (id) do nothing;

alter table public.profiles enable row level security;
alter table public.entitlements enable row level security;
alter table public.session_attempts enable row level security;
alter table public.transcripts enable row level security;
alter table public.session_metrics enable row level security;
alter table public.ai_critiques enable row level security;
alter table public.commitments enable row level security;
alter table public.user_badges enable row level security;
alter table public.prompt_usage_limits enable row level security;

create policy "profiles are self readable" on public.profiles for select using (auth.uid() = id);
create policy "profiles are self writable" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles are self updatable" on public.profiles for update using (auth.uid() = id);

create policy "entitlements are self readable" on public.entitlements for select using (auth.uid() = user_id);
create policy "attempts are self readable" on public.session_attempts for select using (auth.uid() = user_id);
create policy "attempts are self writable" on public.session_attempts for insert with check (auth.uid() = user_id);
create policy "attempts are self updatable" on public.session_attempts for update using (auth.uid() = user_id);

create policy "transcripts follow attempt owner" on public.transcripts for select using (
  exists (select 1 from public.session_attempts a where a.id = attempt_id and a.user_id = auth.uid())
);
create policy "metrics follow attempt owner" on public.session_metrics for select using (
  exists (select 1 from public.session_attempts a where a.id = attempt_id and a.user_id = auth.uid())
);
create policy "critiques are self readable" on public.ai_critiques for select using (auth.uid() = user_id);
create policy "commitments are self readable" on public.commitments for select using (auth.uid() = user_id);
create policy "commitments are self writable" on public.commitments for insert with check (auth.uid() = user_id);
create policy "commitments are self updatable" on public.commitments for update using (auth.uid() = user_id);
create policy "badges are self readable" on public.user_badges for select using (auth.uid() = user_id);
create policy "limits are self readable" on public.prompt_usage_limits for select using (auth.uid() = user_id);

create policy "users can read own recordings" on storage.objects for select using (
  bucket_id = 'recordings' and auth.uid()::text = (storage.foldername(name))[1]
);
create policy "users can upload own recordings" on storage.objects for insert with check (
  bucket_id = 'recordings' and auth.uid()::text = (storage.foldername(name))[1]
);
create policy "users can read reference audio" on storage.objects for select using (
  bucket_id = 'reference-audio'
);
create policy "users can read own share clips" on storage.objects for select using (
  bucket_id = 'share-clips' and auth.uid()::text = (storage.foldername(name))[1]
);
create policy "users can upload own share clips" on storage.objects for insert with check (
  bucket_id = 'share-clips' and auth.uid()::text = (storage.foldername(name))[1]
);

create index session_attempts_user_session_idx on public.session_attempts (user_id, session_id);
create index session_attempts_completed_idx on public.session_attempts (user_id, completed_at desc);
create index ai_critiques_user_session_idx on public.ai_critiques (user_id, session_id);
create index session_metrics_attempt_idx on public.session_metrics (attempt_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

insert into public.badges (id, title, description) values
  ('streak-3', 'Three-day signal', 'Completed sessions on three practice days.'),
  ('streak-7', 'Seven-day cadence', 'Completed sessions on seven practice days.'),
  ('sprint-1', 'Notice complete', 'Finished Sprint 1.'),
  ('sprint-2', 'Steady complete', 'Finished Sprint 2.'),
  ('sprint-3', 'Lead complete', 'Finished Sprint 3.'),
  ('capstone', 'Full transformation', 'Completed the capstone replay.');
