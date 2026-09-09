-- First vertical slice of the entity/claim layer described in the data
-- infrastructure audit: Scout already extracts entities (people, companies,
-- technologies, projects) mentioned in a source, and Researcher already
-- produces structured claims with an epistemic status and evidence quote —
-- but today both are discarded as soon as a candidate is published, leaving
-- only the resulting resource node. This makes entities addressable nodes
-- in their own right (same (type, slug) addressing as kg_nodes/kg_relationships,
-- so no changes are needed there — "entity" is just a new value for
-- from_type/to_type) and gives claims a home that survives publication.

create table if not exists public.entities (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in ('person', 'company', 'technology', 'project')),
  slug text not null,
  canonical_name text not null,
  aliases text[] not null default '{}',
  description text,
  external_ids jsonb not null default '{}'::jsonb,
  status text not null default 'published' check (status in ('published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (entity_type, slug)
);

create table if not exists public.claims (
  id uuid primary key default gen_random_uuid(),
  node_id uuid not null references public.kg_nodes(id) on delete cascade,
  statement text not null,
  epistemic_status text not null,
  evidence text,
  source_id uuid references public.kg_sources(id) on delete set null,
  research_candidate_id uuid references public.research_candidates(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists claims_node_idx on public.claims(node_id);
create index if not exists entities_type_idx on public.entities(entity_type, status);

alter table public.entities enable row level security;
alter table public.claims enable row level security;

create policy "service role can manage entities" on public.entities
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "service role can manage claims" on public.claims
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
