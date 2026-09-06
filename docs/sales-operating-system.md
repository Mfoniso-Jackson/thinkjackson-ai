# Sales Operating System

## Purpose

The ThinkJackson Sales OS turns the public site into a commercial operating loop:

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
6. The payload is inserted into `public.sales_leads` in Supabase, or fails safely with an email fallback if Supabase isn't configured.
7. A future CRM store can turn the lead into an opportunity with a next action. Note: `data/sales-dashboard.ts` (the admin pipeline UI) does not read from `sales_leads` yet — leads are captured, but the dashboard itself is still a static placeholder.

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
- `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`: required for the contact and investor forms to write to `public.sales_leads`. The service role key, not the anon/publishable one — every table here has RLS locked to `service_role`.

## Pipeline Rules

Active stages require a next action and next action date. Terminal stages are `Won`, `Lost`, `Future`, `Paused`, and `Disqualified`.

## Operating Instructions

- Open `/admin/sales/today` first.
- Review overdue tasks and leads without activity.
- Move qualified records into opportunities.
- Never leave an active opportunity without a next action.
- When a deal is won, create onboarding, milestone, testimonial, referral, case study, and evidence tasks.
- Publish only approved public evidence.
