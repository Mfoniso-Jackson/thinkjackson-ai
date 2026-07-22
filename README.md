# thinkjackson

Production-ready personal brand website for Mfoniso Jackson, built with Next.js App Router, TypeScript, Tailwind CSS, and Framer Motion.

## Positioning

**AI systems for markets, agents, and human coordination.**

The site presents Mfoniso as an AI engineer, researcher, and founder working across financial engineering, reinforcement learning, autonomous agents, AI safety, Web3 coordination systems, and portfolio intelligence.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Vercel Analytics
- MDX writing content
- Local typed content data
- SEO metadata, robots, and sitemap
- Vercel-ready deployment
- Private AI-assisted founder Execution OS

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Useful Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npx tsc --noEmit
npm test
```

## Content Model

Primary site data lives in [`data/site.ts`](./data/site.ts). Project briefs, research metadata, consulting offers, launch copy, writing tracks, and editorial queue items are structured there.

Long-form writing lives in [`content/writing`](./content/writing) as MDX files. Each essay exports a `metadata` object with `slug`, `title`, `excerpt`, `date`, `readingTime`, `tags`, and `sections`, then the file is registered in [`lib/writing.ts`](./lib/writing.ts). Reusable essay blocks live in [`components/mdx-blocks.tsx`](./components/mdx-blocks.tsx), including `Callout`, `Principle`, `ResearchNote`, and `References` for further reading sections.

## Pages

- `/`
- `/about`
- `/research`
- `/research/computational-superstition`
- `/projects`
- `/projects/[slug]`
- `/writing`
- `/writing/[slug]`
- `/now`
- `/consulting`
- `/contact`
- `/launch`

## Deployment

Deploy on Vercel by importing the repository and using the default Next.js settings.

Recommended production settings:

- Framework preset: Next.js
- Build command: `npm run build`
- Install command: `npm install`
- Output directory: `.next`

Email currently points to `hello@thinkjackson.com`.

## Execution OS

The private AI-assisted daily mission workflow is available at `/admin/execution`. Apply the founder OS Supabase migration and configure the server-only variables documented in [`.env.example`](./.env.example). Architecture, privacy, and setup details are in [`docs/execution-os.md`](./docs/execution-os.md).
