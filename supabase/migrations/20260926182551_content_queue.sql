-- A lightweight backlog for planned content (launch posts, newsletter
-- issues, and the operating-brief's Signal/Research/Framework/Build
-- categories) — deliberately separate from kg_nodes: this tracks content
-- the founder is planning/writing, not discovered research awaiting
-- publication. Same "don't overengineer" posture as everything else here:
-- no scheduling engine, no rich editor, just a real status a human moves
-- through by hand.

create table if not exists public.content_queue (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content_type text not null check (content_type in ('launch', 'newsletter', 'signal', 'research', 'framework', 'build')),
  status text not null default 'idea' check (status in ('idea', 'drafted', 'scheduled', 'published')),
  body text,
  notes text,
  published_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists content_queue_status_idx on public.content_queue(status, created_at desc);

alter table public.content_queue enable row level security;

create policy "service role can manage content queue" on public.content_queue
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
