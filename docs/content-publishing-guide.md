# Content Publishing Guide

thinkjackson should publish content that makes the venture thesis inspectable. Avoid generic founder updates. Each post should clarify an original idea, explain a system, document a product decision, or create evidence for diligence.

## Writing Types

- Flagship essay: long-form thesis piece with references and durable positioning.
- Field note: shorter observation from product work, market design, or research.
- Venture memo: product-specific thesis note linked from a project page.
- Evidence update: source-backed release note or milestone.

## Publication Checklist

- Add the MDX file to `content/writing`.
- Export `metadata` with `title`, `slug`, `date`, `excerpt`, `readingTime`, and `tags`.
- Register the post in `lib/writing.ts`.
- Link it from the related venture page through the venture data model when relevant.
- Run lint and build before publishing.

## Evidence Rules

- Do not publish revenue, users, customer counts, pilots, partnerships, grants, or performance claims unless there is a source artifact.
- If a claim needs founder confirmation, keep it in docs or mark it as source-data pending.
- Prefer exact artifacts over vague motion: repository, demo, essay, signed pilot, analytics export, or dated release note.
