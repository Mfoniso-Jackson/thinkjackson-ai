# Investor Site Implementation

## Strategic changes

- Repositioned the site from research portfolio to investor-facing venture platform while preserving the research-led identity.
- Added a central typed venture layer in `data/ventures.ts`.
- Added runtime validation for flagship uniqueness and private-link prevention.
- Rebuilt the homepage around investor comprehension: thesis, flagship, portfolio, founder advantage, research moat, evidence, objectives, and CTA.
- Added `/investors` as the public due-diligence front door.

## Routes added or upgraded

- `/` upgraded to investor-led homepage.
- `/investors` added for investor overview, venture matrix, current objectives, evidence, and material request form.
- `/projects` upgraded to venture portfolio page.
- `/projects/[slug]` upgraded to reusable investor-grade venture brief template.
- `/about` upgraded to institutional founder profile.
- `/privacy` added.
- `/site-notice` added.

## Components added

- `components/venture-card.tsx`
- `components/investor-lead-form.tsx`
- `components/analytics-marker.tsx`

## Content model

- `lib/venture-types.ts` defines `VentureStage`, `CapitalObjective`, `EvidenceItem`, and `Venture`.
- `data/ventures.ts` stores public venture data, capability thesis, capital objective labels, investor overview, and founder profile.
- `lib/venture-validation.ts` validates there is exactly one flagship and blocks obvious private/local links.

## Investor lead pipeline

- The site has no database backend today.
- `app/investors/actions.ts` validates submissions on the server and posts to `INVESTOR_LEAD_WEBHOOK_URL` when configured.
- If no webhook is configured, the form returns a safe error directing the sender to `hello@thinkjackson.com`.
- Honeypot spam protection is included via a hidden `website` field.
- No service-role key or private credential is exposed to the client.

## Environment variables

- `INVESTOR_LEAD_WEBHOOK_URL`: secure server-side webhook endpoint for investor lead routing.
- `INVESTOR_LEAD_WEBHOOK_SECRET`: optional bearer token for the webhook.

## Database migrations

- None added because this repository has no Supabase or database client configured.
- If Supabase is later added, create an `investor_leads` table with RLS, no public reads, controlled inserts, and private notes excluded from client access.

## Analytics events

Typed helper: `lib/analytics.ts`.

Events supported:

- `investor_brief_viewed`
- `flagship_venture_viewed`
- `venture_page_viewed`
- `investor_cta_clicked`
- `investor_form_started`
- `investor_form_submitted`
- `scheduling_link_clicked`
- `deck_request_submitted`
- `outbound_repository_clicked`

## Trust and security

- Added `/privacy`.
- Added `/site-notice`.
- Added footer disclaimer that content is informational and not financial advice or an offer to sell securities.
- Added security headers in `next.config.ts`.

## Changing the flagship venture

Edit `data/ventures.ts` and set exactly one public venture to `flagship: true`.
The validation layer throws if zero or multiple public flagship ventures are configured.

## Updating venture stages and objectives

Use the union values in `lib/venture-types.ts`.
Do not add public metrics unless evidence exists in `evidence` with `verified: true`.

## Founder decisions still required

See `docs/founder-input-required.md`.
