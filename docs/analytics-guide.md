# Analytics Guide

The site currently uses Vercel Analytics for lightweight page and event tracking. This is enough for early launch, but the evidence dashboard should not show user or conversion metrics until the data source is connected and reviewed.

## Current Tracking

- Page views through `@vercel/analytics`.
- Typed client events in `lib/analytics.ts`.
- Investor lead form intent through `components/investor-lead-form.tsx`.

## Recommended Next Events

- `evidence_dashboard_viewed`
- `venture_page_viewed`
- `investor_materials_requested`
- `writing_post_viewed`
- `external_repository_clicked`
- `contact_channel_clicked`

## Future Data Sources

- Vercel Analytics for traffic.
- Supabase for investor lead and newsletter records.
- Product databases for usage metrics.
- Founder-maintained CRM or spreadsheet for customer interviews and partnership conversations.

Do not mix analytics-derived counts with founder-entered commercial evidence unless the source is clear.
