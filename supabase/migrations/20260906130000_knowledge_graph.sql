-- Knowledge graph foundation for the agent-native vertical slice.
-- Nodes/relationships are stored generically (a `type` column, not one
-- table per node type) so they can reference either a brand-new
-- agent-discovered node or an existing founder-authored one (an idea,
-- venture, person, or essay that lives in the static data files, not in
-- this database). Relationships are addressed by (type, slug) pairs for
-- exactly that reason — a foreign key to kg_nodes.id would only work for
-- half of what this graph needs to connect.

create table if not exists public.kg_nodes (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  slug text not null,
  title text not null,
  summary text not null,
  metadata jsonb not null default '{}'::jsonb,
  status text not null default 'published' check (status in ('published', 'archived')),
  created_by text not null default 'agent:librarian',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (type, slug)
);

create table if not exists public.kg_sources (
  id uuid primary key default gen_random_uuid(),
  url text not null unique,
  source_type text not null default 'article',
  title text,
  published_at timestamptz,
  retrieved_at timestamptz not null default now(),
  human_verified boolean not null default false,
  raw_excerpt text,
  created_at timestamptz not null default now()
);

create table if not exists public.kg_relationships (
  id uuid primary key default gen_random_uuid(),
  from_type text not null,
  from_slug text not null,
  relation_type text not null,
  to_type text not null,
  to_slug text not null,
  confidence numeric check (confidence between 0 and 1),
  source_id uuid references public.kg_sources(id) on delete set null,
  created_by text not null default 'agent:librarian',
  created_at timestamptz not null default now()
);

create table if not exists public.research_candidates (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.kg_sources(id) on delete set null,
  status text not null default 'discovered' check (
    status in ('discovered', 'investigating', 'verified', 'rejected', 'published')
  ),
  title text not null,
  summary text not null,
  payload jsonb not null default '{}'::jsonb,
  reviewed_by text,
  reviewed_at timestamptz,
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.agent_logs (
  id uuid primary key default gen_random_uuid(),
  agent text not null,
  research_candidate_id uuid references public.research_candidates(id) on delete set null,
  model text,
  latency_ms integer,
  token_usage jsonb not null default '{}'::jsonb,
  request_success boolean not null,
  schema_valid boolean,
  error_code text,
  created_at timestamptz not null default now()
);

create index if not exists kg_relationships_from_idx on public.kg_relationships(from_type, from_slug);
create index if not exists kg_relationships_to_idx on public.kg_relationships(to_type, to_slug);
create index if not exists research_candidates_status_idx on public.research_candidates(status, created_at desc);
create index if not exists agent_logs_candidate_idx on public.agent_logs(research_candidate_id);

alter table public.kg_nodes enable row level security;
alter table public.kg_sources enable row level security;
alter table public.kg_relationships enable row level security;
alter table public.research_candidates enable row level security;
alter table public.agent_logs enable row level security;

create policy "service role can manage kg nodes" on public.kg_nodes
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "service role can manage kg sources" on public.kg_sources
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "service role can manage kg relationships" on public.kg_relationships
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "service role can manage research candidates" on public.research_candidates
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "service role can manage agent logs" on public.agent_logs
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
