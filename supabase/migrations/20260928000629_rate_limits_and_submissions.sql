-- Shared rate limiting for the first two genuinely public-facing surfaces
-- that can trigger real AI/pipeline cost (Submit to the Map, Ask
-- ThinkJackson) — everything before this was admin- or cron-gated. A soft,
-- day-bucketed counter is a reasonable deterrent against casual abuse, not
-- a hard security boundary (a determined attacker can rotate IPs regardless
-- of what's built here) — matching the "don't overengineer" posture used
-- everywhere else in this project. IPs are hashed, never stored raw, per
-- the operating brief's "avoid invasive personal profiling" instruction.

create table if not exists public.rate_limits (
  bucket text primary key,
  count integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.rate_limits enable row level security;

create policy "service role can manage rate limits" on public.rate_limits
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
