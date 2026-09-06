create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null unique,
  source_page text,
  status text not null default 'subscribed' check (status in ('subscribed', 'unsubscribed'))
);

create index if not exists newsletter_subscribers_email_idx on public.newsletter_subscribers(email);

alter table public.newsletter_subscribers enable row level security;

create policy "service role can manage newsletter subscribers" on public.newsletter_subscribers
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
