import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { SalesCtaGroup } from "@/components/sales-cta";
import { VentureCard } from "@/components/venture-card";
import { WritingCard } from "@/components/writing-card";
import { capabilityThesis, capitalObjectiveLabels, flagshipVenture, founderProfile, publicVentures } from "@/data/ventures";
import { writingPosts } from "@/lib/writing";
import { verifiedEvidence } from "@/lib/venture-validation";

export const metadata: Metadata = {
  title: "AI Venture Builder",
  description:
    "Mfoniso Jackson builds adaptive intelligence infrastructure for markets, risk, autonomous agents, and economic coordination.",
  alternates: {
    canonical: "/"
  }
};

export default function Home() {
  const featuredVentures = publicVentures.filter((venture) => venture.featured);
  const activeObjectives = publicVentures.filter((venture) => venture.capitalObjectives[0] !== "not-raising").slice(0, 4);

  return (
    <>
      <section className="relative overflow-hidden py-24 sm:py-32 lg:py-40">
        <Container>
          <div className="max-w-5xl">
            <Reveal>
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-signal">
                Mfoniso Jackson · AI Engineer and Venture Builder
              </p>
              <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
                Building adaptive intelligence infrastructure for markets, risk and economic coordination.
              </h1>
              <p className="mt-7 max-w-4xl text-lg leading-8 text-steel sm:text-xl">
                thinkjackson is the research and venture platform behind AI-native systems spanning financial
                intelligence, autonomous agents, risk infrastructure, property operations, worker recognition,
                incident intelligence, and adaptive-agent safety.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button href="/projects">Explore the Venture Portfolio</Button>
                <Button href="/investors" variant="secondary">
                  Read the Investor Brief
                </Button>
              </div>
              <Link href="/research" className="mt-5 inline-flex text-sm font-semibold text-signal hover:text-white">
                Explore the research thesis
              </Link>
            </Reveal>
          </div>
        </Container>
      </section>

      <section id="thesis" className="border-y border-line bg-graphite/70 py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHeading eyebrow="Capital thesis" title="One technical thesis. Multiple high-value markets.">
              <p>
                The ventures are connected by a reusable capability stack for environments where capital, risk,
                trust, incentives, and autonomous agents interact.
              </p>
            </SectionHeading>
            <div className="grid gap-3 sm:grid-cols-2">
              {capabilityThesis.map((capability) => (
                <div key={capability} className="rounded-lg border border-line bg-white/[0.035] p-4 text-sm font-medium text-white">
                  {capability}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionHeading eyebrow="Flagship opportunity" title={flagshipVenture.name}>
            <p>{flagshipVenture.investmentThesis}</p>
          </SectionHeading>
          <div className="mt-10 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-lg border border-line bg-white/[0.035] p-7">
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-signal">{flagshipVenture.category}</p>
              <h3 className="mt-4 text-3xl font-semibold text-white">{flagshipVenture.tagline}</h3>
              <p className="mt-5 text-base leading-8 text-steel">{flagshipVenture.problem}</p>
              <p className="mt-5 text-base leading-8 text-white">{flagshipVenture.solution}</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button href={`/projects/${flagshipVenture.slug}`}>Full venture page</Button>
                <Button href="/investors#request" variant="secondary">
                  Request investor materials
                </Button>
              </div>
            </div>
            <div className="grid gap-4">
              {[
                ["Stage", flagshipVenture.statusLabel],
                ["Current objective", flagshipVenture.currentAsk],
                ["Next milestone", flagshipVenture.nextMilestone]
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-line bg-ink/70 p-5">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">{label}</p>
                  <p className="mt-3 text-sm leading-6 text-steel">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-graphite/60 py-20">
        <Container>
          <SectionHeading eyebrow="Venture portfolio" title="Disciplined systems, not a startup directory." />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featuredVentures.map((venture, index) => (
              <Reveal key={venture.slug} delay={index * 0.04}>
                <VentureCard venture={venture} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHeading eyebrow="Founder advantage" title="Why this founder, why these problems, why now.">
              <p>{founderProfile.thesis}</p>
            </SectionHeading>
            <div className="grid gap-4">
              {founderProfile.verifiedFacts.map((fact) => (
                <div key={fact} className="rounded-lg border border-line bg-white/[0.035] p-5 text-sm leading-6 text-steel">
                  {fact}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-graphite/60 py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <SectionHeading eyebrow="Research moat" title="Adaptive-agent research as technical differentiation.">
              <p>
                Computational superstition research studies proxy persistence, false correlation, and behavior that
                remains stable after reward conditions change. For market agents and decision systems, that becomes
                a practical lens for regime change, risk memory, and safer adaptation.
              </p>
            </SectionHeading>
            <div className="grid gap-3">
              {[
                "More robust autonomous agents",
                "Better detection of false correlations",
                "Safer strategy adaptation under regime change",
                "Improved interpretability of decision systems",
                "Defensible technical knowledge across the venture portfolio"
              ].map((item) => (
                <div key={item} className="rounded-lg border border-line bg-white/[0.035] p-4 text-sm text-white">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionHeading eyebrow="Execution evidence" title="Public proof-of-work." />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {publicVentures.flatMap((venture) =>
              verifiedEvidence(venture).slice(0, 1).map((item) => (
                <Link
                  key={`${venture.slug}-${item.label}`}
                  href={item.url ?? `/projects/${venture.slug}`}
                  target={item.url?.startsWith("http") ? "_blank" : undefined}
                  rel={item.url?.startsWith("http") ? "noreferrer" : undefined}
                  className="rounded-lg border border-line bg-white/[0.035] p-5 transition hover:border-signal/35"
                >
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">{venture.name}</p>
                  <h3 className="mt-3 text-lg font-semibold text-white">{item.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-steel">{item.description}</p>
                </Link>
              ))
            )}
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-graphite/60 py-20">
        <Container>
          <SectionHeading eyebrow="Current capital objectives" title="What aligned counterparties can help unlock." />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {activeObjectives.map((venture) => (
              <div key={venture.slug} className="rounded-lg border border-line bg-white/[0.035] p-5">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">{venture.name}</p>
                <h3 className="mt-3 text-xl font-semibold text-white">
                  {venture.capitalObjectives.map((objective) => capitalObjectiveLabels[objective]).join(" / ")}
                </h3>
                <p className="mt-3 text-sm leading-6 text-steel">{venture.currentAsk}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHeading eyebrow="Selected writing" title="Research notes investors can inspect.">
              <p>Writing is part of the diligence path: it shows the technical thesis behind the venture portfolio.</p>
            </SectionHeading>
            <div className="grid gap-5">
              {writingPosts.slice(0, 2).map((post) => (
                <WritingCard key={post.slug} {...post} />
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-line bg-graphite/70 py-20">
        <Container>
          <SalesCtaGroup
            sourcePage="/"
            title="Interested in the systems being built?"
            description="Aligned investors, grant organisations, strategic partners, pilot customers, and domain experts can request the appropriate public or confidential path."
          />
        </Container>
      </section>
    </>
  );
}
