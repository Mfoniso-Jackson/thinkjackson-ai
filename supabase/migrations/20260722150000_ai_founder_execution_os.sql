create extension if not exists pgcrypto;

create table if not exists public.execution_projects (
  id uuid primary key default gen_random_uuid(), owner_id text not null, name text not null, slug text not null,
  description text not null default '', stage text not null default '', target_customer text not null default '', customer_problem text not null default '', value_proposition text not null default '',
  current_priority text not null default '', current_bottleneck text not null default '', current_metrics jsonb not null default '[]', current_risks jsonb not null default '[]',
  active_milestones jsonb not null default '[]', open_assumptions jsonb not null default '[]', product_urls jsonb not null default '[]', repository_urls jsonb not null default '[]', context_notes text not null default '',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(owner_id, slug)
);
create table if not exists public.execution_missions (
  id uuid primary key default gen_random_uuid(), owner_id text not null, project_id uuid not null references public.execution_projects(id) on delete cascade,
  title text not null, desired_outcome text not null, why_it_matters text not null, definition_of_done text not null, mission_type text not null, primary_risk text not null,
  assumption_being_tested text not null, success_metric_name text not null, success_metric_target text not null, confidence_before integer not null check (confidence_before between 1 and 10),
  confidence_after integer check (confidence_after between 1 and 10), estimated_minutes integer not null check (estimated_minutes > 0), actual_minutes integer, energy text not null,
  status text not null default 'draft' check (status in ('draft','active','paused','completed','cancelled')), reasoning_summary text not null, public_build_angle text not null,
  do_not_work_on jsonb not null default '[]', end_review_questions jsonb not null default '[]', expected_evidence jsonb not null default '[]',
  started_at timestamptz, completed_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create unique index if not exists one_active_execution_mission_per_owner on public.execution_missions(owner_id) where status = 'active';
create table if not exists public.execution_mission_tasks (
  id uuid primary key default gen_random_uuid(), owner_id text not null, mission_id uuid not null references public.execution_missions(id) on delete cascade,
  title text not null, description text not null, sort_order integer not null check (sort_order between 1 and 3), estimated_minutes integer not null, status text not null default 'open', completed_at timestamptz
);
create table if not exists public.execution_evidence (
  id uuid primary key default gen_random_uuid(), owner_id text not null, project_id uuid references public.execution_projects(id) on delete cascade, mission_id uuid references public.execution_missions(id) on delete set null,
  type text not null, title text not null, description text not null, url text, file_reference text, metric_name text, metric_value text,
  visibility text not null default 'private' check (visibility in ('private','portfolio','public')), created_at timestamptz not null default now()
);
create table if not exists public.execution_mission_reviews (
  id uuid primary key default gen_random_uuid(), owner_id text not null, mission_id uuid not null unique references public.execution_missions(id) on delete cascade,
  outcome_achieved boolean not null, actual_metric text not null, learning text not null, assumption_update text not null, next_mission_suggestion text, created_at timestamptz not null default now()
);
create table if not exists public.execution_ai_logs (
  id uuid primary key default gen_random_uuid(), owner_id text not null, model text not null, latency_ms integer, token_usage jsonb not null default '{}', request_success boolean not null,
  schema_valid boolean, quality_valid boolean, error_code text, created_at timestamptz not null default now()
);

create index if not exists execution_missions_owner_project_idx on public.execution_missions(owner_id, project_id, created_at desc);
create index if not exists execution_evidence_owner_project_idx on public.execution_evidence(owner_id, project_id, created_at desc);
alter table public.execution_projects enable row level security; alter table public.execution_missions enable row level security; alter table public.execution_mission_tasks enable row level security;
alter table public.execution_evidence enable row level security; alter table public.execution_mission_reviews enable row level security; alter table public.execution_ai_logs enable row level security;
create policy "service manages execution projects" on public.execution_projects for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "service manages execution missions" on public.execution_missions for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "service manages execution tasks" on public.execution_mission_tasks for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "service manages execution evidence" on public.execution_evidence for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "service manages execution reviews" on public.execution_mission_reviews for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "service manages execution ai logs" on public.execution_ai_logs for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

insert into public.execution_projects (id, owner_id, name, slug, description, stage, target_customer, customer_problem, value_proposition, current_priority, current_bottleneck, current_risks, open_assumptions)
values
('8d2bb2d0-79d9-4b99-9be0-f2ed1c083b11','mfoniso','OmniQuantAI','omniquantai','Flagship AI-native quantitative intelligence and agent orchestration platform.','Validation','Head of Quantitative Research, Portfolio Manager, or founder of a crypto hedge fund, proprietary trading firm, or digital asset investment firm.','Research teams spend too much time manually monitoring markets, generating hypotheses, validating strategies, and preparing actionable research.','An AI quant research analyst that continuously monitors markets, detects meaningful changes, investigates opportunities, and produces structured, evidence-backed research.','Generate strong external evidence that professional users value the research and decision-support workflow.','Limited professional user validation and an unclear first paid use case.','["Unclear first paid use case","Limited professional user validation","Insufficient distribution","Potential overengineering","Weak proof that users will pay","Unclear separation from MassifX"]','["Professional research teams will adopt an autonomous daily research brief","At least one target segment will pay for decision-support output"]'),
('44b13f88-ded6-42ed-bc56-d97df53a15ce','mfoniso','MassifX','massifx','Commercial AI trading intelligence and professional decision-support product powered by OmniQuantAI.','Validation','Professional crypto trader, portfolio manager, proprietary trader, or small digital asset fund.','TradingView, ChatGPT, notebooks, news tools, and risk tools are disconnected and require substantial manual interpretation.','MassifX detects important market developments, investigates them, scores confidence, supports position sizing, and continuously monitors risk.','Prove measurable improvements in research speed, opportunity detection, risk monitoring, or decision consistency.','No measurable professional adoption or repeatable acquisition channel.','["Insufficient differentiation from TradingView plus ChatGPT","No proof of improved decision quality","Limited professional adoption","No repeatable acquisition channel","Feature overbuild before validation"]','["Professionals will pay for integrated opportunity detection and risk monitoring"]')
on conflict (owner_id, slug) do update set updated_at = now();
