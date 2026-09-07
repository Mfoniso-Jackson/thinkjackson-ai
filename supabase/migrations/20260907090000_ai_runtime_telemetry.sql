-- Extends the existing agent_logs table (does not create a new one) so the
-- AI Runtime's telemetry can answer "what does the infra actually use" and
-- "which models are best for which workload" across every task type, not
-- just the research pipeline that originally created this table.

alter table public.agent_logs
  add column if not exists task_type text,
  add column if not exists estimated_cost_usd numeric not null default 0;

create index if not exists agent_logs_task_type_idx on public.agent_logs(task_type, created_at desc);
