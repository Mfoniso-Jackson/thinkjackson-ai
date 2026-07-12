# Sales Operating System

## Purpose

The thinkjackson Sales OS turns the public site into a commercial operating loop:

Authority -> Attention -> Lead capture -> Qualification -> Discovery -> Proposal -> Follow-up -> Commitment -> Delivery -> Evidence -> Referral -> More demand.

It is designed for founder-led sales across investors, pilot customers, partners, grants, research sponsors, consulting, and enterprise opportunities.

## Architecture

- Public CTA context: `components/sales-cta.tsx`
- Dynamic public form: `components/sales-lead-form.tsx`
- Lead server action: `app/contact/actions.ts`
- Sales types: `lib/sales-types.ts`
- Validation: `lib/sales-validation.ts`
- Scoring: `lib/sales-scoring.ts`
- Config: `data/sales-config.ts`
- Admin dashboard data boundary: `data/sales-dashboard.ts`
- Protected admin shell: `/admin/sales`
- Supabase-ready migration: `supabase/migrations/20260712120000_sales_operating_system.sql`

## Public-to-Private Flow

1. A visitor clicks a contextual CTA.
2. The CTA passes `intent`, `venture`, `sourcePage`, and `campaign` to `/contact`.
3. The form adds referrer and UTM context.
4. Server-side validation, honeypot, and rate limiting run.
5. The lead is scored transparently.
6. The payload is sent to `SALES_LEAD_WEBHOOK_URL` or fails safely with an email fallback.
7. A future CRM store can turn the lead into an opportunity with a next action.

## Security Model

- `/admin/sales/*` is protected by Basic Auth middleware.
- Required env: `ADMIN_SALES_PASSWORD`.
- Optional env: `ADMIN_SALES_USERNAME`, defaults to `mfoniso`.
- Admin routes emit `x-robots-tag: noindex, nofollow`.
- Admin metadata is `noindex`.
- No CRM records are public.
- No admin secrets are exposed in client components.

## Environment Variables

- `ADMIN_SALES_PASSWORD`: required to access admin routes.
- `ADMIN_SALES_USERNAME`: optional, defaults to `mfoniso`.
- `SALES_LEAD_WEBHOOK_URL`: private lead ingestion endpoint.
- `SALES_LEAD_WEBHOOK_SECRET`: optional bearer token.
- `INVESTOR_LEAD_WEBHOOK_URL`: fallback for existing investor route.
- `INVESTOR_LEAD_WEBHOOK_SECRET`: fallback bearer token.

## Pipeline Rules

Active stages require a next action and next action date. Terminal stages are `Won`, `Lost`, `Future`, `Paused`, and `Disqualified`.

## Operating Instructions

- Open `/admin/sales/today` first.
- Review overdue tasks and leads without activity.
- Move qualified records into opportunities.
- Never leave an active opportunity without a next action.
- When a deal is won, create onboarding, milestone, testimonial, referral, case study, and evidence tasks.
- Publish only approved public evidence.
