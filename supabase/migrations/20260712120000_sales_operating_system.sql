create table if not exists public.sales_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  full_name text not null,
  email text not null,
  organisation text not null,
  role text,
  location_or_market text,
  intent text not null,
  venture_slug text,
  source_page text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  campaign text,
  preferred_next_step text,
  status text not null default 'new',
  notes text,
  raw_payload jsonb not null default '{}'::jsonb,
  qualification jsonb not null default '{}'::jsonb
);

create table if not exists public.sales_opportunities (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  lead_id uuid references public.sales_leads(id) on delete set null,
  venture_slug text,
  stage text not null default 'identified',
  priority text not null default 'medium',
  opportunity_type text not null,
  estimated_value numeric,
  currency text default 'GBP',
  probability integer,
  expected_close_date date,
  next_action text,
  next_action_date date,
  owner text,
  last_interaction_at timestamptz,
  outcome_reason text,
  constraint active_opportunities_have_next_action check (
    stage in ('won', 'lost', 'future', 'paused', 'disqualified')
    or (next_action is not null and next_action_date is not null)
  )
);

create table if not exists public.sales_interactions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  opportunity_id uuid not null references public.sales_opportunities(id) on delete cascade,
  type text not null,
  occurred_at timestamptz not null,
  summary text not null,
  next_step text
);

create table if not exists public.sales_tasks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  opportunity_id uuid references public.sales_opportunities(id) on delete cascade,
  lead_id uuid references public.sales_leads(id) on delete cascade,
  title text not null,
  due_date date not null,
  priority text not null default 'medium',
  status text not null default 'open',
  context text
);

create table if not exists public.sales_proposals (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  opportunity_id uuid not null references public.sales_opportunities(id) on delete cascade,
  title text not null,
  status text not null default 'draft',
  problem text not null,
  proposed_solution text not null,
  deliverables jsonb not null default '[]'::jsonb,
  commercial_model text,
  value numeric,
  currency text default 'GBP',
  valid_until date
);

create table if not exists public.sales_evidence_assets (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  venture_slug text,
  type text not null,
  date date not null,
  visibility text not null default 'private',
  source_url text,
  verified boolean not null default false,
  summary text not null,
  metrics jsonb not null default '[]'::jsonb,
  permission_status text not null default 'pending'
);

create index if not exists sales_leads_email_idx on public.sales_leads(email);
create index if not exists sales_leads_intent_idx on public.sales_leads(intent);
create index if not exists sales_opportunities_stage_idx on public.sales_opportunities(stage);
create index if not exists sales_tasks_due_date_idx on public.sales_tasks(due_date);

alter table public.sales_leads enable row level security;
alter table public.sales_opportunities enable row level security;
alter table public.sales_interactions enable row level security;
alter table public.sales_tasks enable row level security;
alter table public.sales_proposals enable row level security;
alter table public.sales_evidence_assets enable row level security;

create policy "service role can manage sales leads" on public.sales_leads
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

create policy "service role can manage sales opportunities" on public.sales_opportunities
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

create policy "service role can manage sales interactions" on public.sales_interactions
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

create policy "service role can manage sales tasks" on public.sales_tasks
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

create policy "service role can manage sales proposals" on public.sales_proposals
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

create policy "service role can manage sales evidence assets" on public.sales_evidence_assets
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
