-- Allow authenticated users to insert related session data through edge functions or client fallbacks.

create policy "transcripts follow attempt owner insert" on public.transcripts for insert with check (
  exists (select 1 from public.session_attempts a where a.id = attempt_id and a.user_id = auth.uid())
);

create policy "metrics follow attempt owner insert" on public.session_metrics for insert with check (
  exists (select 1 from public.session_attempts a where a.id = attempt_id and a.user_id = auth.uid())
);

create policy "critiques are self writable" on public.ai_critiques for insert with check (auth.uid() = user_id);

create policy "attempts are self deletable" on public.session_attempts for delete using (auth.uid() = user_id);
