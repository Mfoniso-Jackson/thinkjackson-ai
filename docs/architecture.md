# ThinkJackson Architecture

ThinkJackson is an evolving map of the emergence of intelligence, and a laboratory for discovering what that emergence makes possible. The production surface is static-first Next.js with typed local content, MDX writing, Vercel Analytics, and explicit founder-input gaps for data that should not be fabricated.

## Core Layers

- `data/ventures.ts`: source of truth for venture positioning, investment thesis, risks, asks, evidence, and public/private visibility.
- `data/evidence.ts`: source of truth for proof-of-work metrics, public artifacts, and execution timeline events.
- `content/writing/*.mdx`: MDX-ready publication layer for essays and thesis notes.
- `app/projects/[slug]/page.tsx`: reusable venture-detail page powered by typed venture data.
- `app/evidence/page.tsx`: diligence dashboard that separates verified proof from missing source data.
- `app/rss.xml/route.ts`: RSS feed generated from local MDX metadata.

## Ontology / Idea Graph Layer

The site models its intellectual content as typed nodes connected by typed relationships, instead of chronological archives. This is a plain relational model — no graph database — designed to expand into a real graph or visual map later without a rewrite.

- `lib/graph/types.ts`: `NodeType`, `RelationType`, `NodeRef`, and `RelationRecord` shapes.
- `lib/graph/registry.ts`: the single `relations` array wiring people, ideas, territories, ventures, and essays together (e.g. `person researches idea`, `venture emerges-from idea`, `essay supports idea`). Idea → territory edges are derived from each idea's `territorySlugs`, not hand-duplicated.
- `lib/graph/resolve.ts`: resolves any `NodeRef` to a displayable `{ title, eyebrow, summary, href }` by reading the relevant data file.
- `components/related-nodes.tsx`: renders the connected nodes for any ref — used on idea, venture, and person pages so "related content" is never hardcoded per page.
- `data/territories.ts`: the five core research territories (Agentic Intelligence, Financial Intelligence, Risk & Uncertainty, Trust & Verification, Economic Coordination).
- `data/ideas.ts`: idea/concept nodes, each tagged with an epistemic status (`fact` / `interpretation` / `hypothesis` / `prediction` / `speculation`) and one or more territories. Also exports `transIntelligence`, the connecting meta-thesis.
- `data/people.ts`: the people network. Only real, verified people are added — no placeholder guests or collaborators.
- `data/podcast.ts`: The Trans-Intelligence Podcast identity and theme list. `episodes` stays empty until a real episode exists.

Deferred by design (see the project brief's staged rollout): Questions and Predictions as full first-class objects with their own index pages, the Research Observatory, and the interactive Trans-Intelligence Map. The `NodeType` union already reserves `question` and `prediction` so the registry does not need to change shape when those are built.

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
