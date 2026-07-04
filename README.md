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

Primary site content lives in [`data/site.ts`](./data/site.ts). Project briefs, writing bodies, research notes, and launch copy are structured there so the project can move to a full MDX loader later without changing the editorial model.

## Pages

- `/`
- `/about`
- `/research`
- `/research/computational-superstition`
- `/projects`
- `/projects/[slug]`
- `/writing`
- `/writing/[slug]`
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
