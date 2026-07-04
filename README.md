# thinkjackson.com

Production-ready personal brand website for Mfoniso Jackson, built with Next.js App Router, TypeScript, Tailwind CSS, and Framer Motion.

## Positioning

**AI systems for markets, agents, and human coordination.**

The site presents Mfoniso as an AI engineer, researcher, and founder working across financial engineering, reinforcement learning, autonomous agents, AI safety, Web3 coordination systems, and portfolio intelligence.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Local typed content arrays
- MDX-ready content folder
- SEO metadata, robots, and sitemap
- Vercel-ready deployment

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
```

## Content Model

Primary site content lives in [`data/site.ts`](./data/site.ts). Writing placeholders are also mirrored in [`public/content/writing`](./public/content/writing) so the project can move to a full MDX loader later without changing the editorial structure.

## Pages

- `/`
- `/about`
- `/research`
- `/projects`
- `/writing`
- `/consulting`
- `/contact`

## Deployment

Deploy on Vercel by importing the repository and using the default Next.js settings.

Recommended production settings:

- Framework preset: Next.js
- Build command: `npm run build`
- Install command: `npm install`
- Output directory: `.next`

Before launch, update the placeholder contact inbox in [`app/contact/page.tsx`](./app/contact/page.tsx).
