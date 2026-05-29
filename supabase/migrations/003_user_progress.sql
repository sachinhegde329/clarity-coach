create table if not exists public.user_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  highest_unlocked_session_number integer not null default 1,
  step_progress_by_session jsonb not null default '{}'::jsonb,
  selected_metric_by_session jsonb not null default '{}'::jsonb,
  last_synced_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_progress enable row level security;

create policy "progress is self readable"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "progress is self writable"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

create policy "progress is self updatable"
  on public.user_progress for update
  using (auth.uid() = user_id);

-- Allow upsert via ON CONFLICT from the client
grant insert, select, update on public.user_progress to authenticated;
