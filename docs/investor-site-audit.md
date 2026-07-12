# Investor Site Audit

## Current strengths

- Next.js App Router, TypeScript, Tailwind CSS, MDX, Vercel Analytics, generated metadata routes, and static generation are already in place.
- The site has a distinctive research-led identity around AI systems for markets, agents, and human coordination.
- Public repositories now support several venture claims: OmniQuantAI, OmniQuantAI CoralOS, MassifX, GratiFi, DomusGraph, LiquidationGuard, and Computational Superstition RL.
- Writing has moved into MDX and includes a flagship essay on Computational Superstition in Reinforcement Learning.
- The design system is restrained, dark, technical, and suitable for an institutional founder platform.

## Investor comprehension gaps

- The previous homepage required too much interpretation to understand the venture portfolio and commercial paths.
- Projects were presented as builder work, not as a disciplined venture portfolio with stage, objective, customer, risk, and evidence.
- There was no public investor brief or due-diligence front door.
- Consulting and general contact competed with investor intent.

## Missing evidence

- No verified revenue, pilots, customers, grants, investors, funding rounds, performance metrics, or backtest results are available in the site repository.
- SentinIQ has supplied positioning but no public repository or demo evidence yet.
- Exact fundraising amounts, incorporation status, and financing structure require founder confirmation before public display.
- Public demo URLs, screenshots, and architecture diagrams are still needed for several ventures.

## Conversion problems

- No investor-specific CTA or form existed.
- No segmentation existed for angel investor, grant provider, pilot customer, strategic partner, research collaborator, media, or general enquiry.
- No qualified diligence pathway existed for decks or private materials.

## Navigation issues

- The old nav led with About, Research, Projects, Writing, Now, Consulting, Contact.
- Investors needed a faster path to Thesis, Ventures, Founder, Investor Brief, and Contact.

## Trust issues

- No privacy page or site notice existed.
- No explicit disclaimer separated public venture descriptions from financial advice or securities offerings.
- No public data-use statement existed for investor requests.

## Technical risks

- The site has no persistent backend or Supabase integration. Investor lead storage must use a secure webhook or future database before production lead collection.
- There is no test runner configured beyond lint/build.
- Some venture status claims depend on founder-supplied positioning and should remain conservative until more evidence is added.

## Opportunities for reuse

- Existing Container, Button, SectionHeading, Reveal, and card patterns support the investor redesign.
- Vercel Analytics can track investor page views and form interactions without adding invasive tooling.
- MDX writing can support research diligence and further reading.

## Founder verification required

- Exact flagship decision if founder wants a different venture than OmniQuantAI.
- Current fundraising status and whether any venture is actively raising.
- Whether web3names.ai experience should be described publicly and how.
- Whether Coventry University degree and BrumHack 2017 placement should remain public.
- Public demo URLs, screenshots, and investor materials for each venture.
