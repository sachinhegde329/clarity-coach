create table if not exists user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  industry text not null default '',
  role text not null default '',
  training_goal text not null default 'General',
  horizons jsonb not null default '[]'::jsonb,
  frictions jsonb not null default '[]'::jsonb,
  duration text not null default '',
  practice_time text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table user_profiles enable row level security;

create policy "Users can read own profile"
  on user_profiles for select
  using (auth.uid() = user_id);

create policy "Users can upsert own profile"
  on user_profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own profile"
  on user_profiles for update
  using (auth.uid() = user_id);
