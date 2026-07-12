# thinkjackson Architecture

thinkjackson is built as an evidence-first personal venture platform. The current production surface is static-first Next.js with typed local content, MDX writing, Vercel Analytics, and explicit founder-input gaps for data that should not be fabricated.

## Core Layers

- `data/ventures.ts`: source of truth for venture positioning, investment thesis, risks, asks, evidence, and public/private visibility.
- `data/evidence.ts`: source of truth for proof-of-work metrics, public artifacts, and execution timeline events.
- `content/writing/*.mdx`: MDX-ready publication layer for essays and thesis notes.
- `app/projects/[slug]/page.tsx`: reusable venture-detail page powered by typed venture data.
- `app/evidence/page.tsx`: diligence dashboard that separates verified proof from missing source data.
- `app/rss.xml/route.ts`: RSS feed generated from local MDX metadata.

## Future CMS Boundary

Supabase/Postgres should be added when the site has live evidence streams such as user counts, customer interviews, revenue, grant submissions, partnership conversations, or product usage. Until then, public metrics should remain in local typed data so claims are reviewable in Git.

Suggested future tables:

- `evidence_artifacts`
- `timeline_events`
- `venture_updates`
- `investor_leads`
- `customer_interviews`
- `product_metrics`
- `writing_subscribers`

Any metric shown publicly should have a source field, owner, date, and verification status.
