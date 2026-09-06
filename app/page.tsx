import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { SalesCtaGroup } from "@/components/sales-cta";
import { VentureCard } from "@/components/venture-card";
import { WritingCard } from "@/components/writing-card";
import { NewsletterForm } from "@/components/newsletter-form";
import { ReferrerAwareHeroCtas } from "@/components/referrer-aware-hero-ctas";
import { ReturningVisitorNote } from "@/components/returning-visitor-note";
import { flagshipVenture, founderProfile, publicVentures } from "@/data/ventures";
import { territories } from "@/data/territories";
import { transIntelligence } from "@/data/ideas";
import { podcast } from "@/data/podcast";
import { writingPosts } from "@/lib/writing";

export const metadata: Metadata = {
  title: "Mapping the Emergence of Intelligence",
  description:
    "ThinkJackson is an evolving map of the emergence of intelligence, and a laboratory for discovering what that emergence makes possible.",
  alternates: {
    canonical: "/"
  }
};

export default function Home() {
  const featuredVentures = publicVentures.filter((venture) => venture.featured);

  return (
    <>
      <section className="relative overflow-hidden py-24 sm:py-32 lg:py-40">
        <Container>
          <div className="max-w-5xl">
            <ReturningVisitorNote />
            <Reveal>
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-signal">
                ThinkJackson · Intelligence Observatory
              </p>
              <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
                An evolving map of the emergence of intelligence.
              </h1>
              <p className="mt-7 max-w-4xl text-lg leading-8 text-steel sm:text-xl">
                {transIntelligence.definition} ThinkJackson investigates that transition through research, essays,
                a podcast, and ventures built as live experiments inside the thesis — not as a separate startup
                portfolio.
              </p>
              <ReferrerAwareHeroCtas />
              <Link href="/ideas/trans-intelligence" className="mt-5 inline-flex text-sm font-semibold text-signal hover:text-white active:text-white">
                Read the Trans-Intelligence thesis
              </Link>
            </Reveal>
          </div>
        </Container>
      </section>

      <section id="thesis" className="border-y border-line bg-graphite/70 py-20">
        <Container>
          <SectionHeading eyebrow="Five research territories" title="Not rigid categories. Where they overlap is where it gets interesting.">
            <p>
              Every idea, essay, venture, and conversation on this site sits inside one or more of these territories.
              The overlaps between them are where Trans-Intelligence becomes observable.
            </p>
          </SectionHeading>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {territories.map((territory, index) => (
              <Reveal key={territory.slug} delay={index * 0.04}>
                <Link
                  href={`/ideas#${territory.slug}`}
                  className="block h-full rounded-lg border border-line bg-white/[0.035] p-6 transition hover:border-signal/35 active:border-signal/50"
                >
                  <p className="font-mono text-xs uppercase tracking-[0.22em] text-signal">{territory.name}</p>
                  <p className="mt-3 text-sm leading-6 text-steel">{territory.definition}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionHeading eyebrow="Ventures as experiments" title="Systems that test the thesis, not a startup directory.">
            <p>
              Each venture is a live experiment inside one or more research territories: a way of finding out whether
              an idea about agents, markets, risk, trust, or coordination survives contact with a real system.
            </p>
          </SectionHeading>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featuredVentures.map((venture, index) => (
              <Reveal key={venture.slug} delay={index * 0.04}>
                <VentureCard venture={venture} />
              </Reveal>
            ))}
          </div>
          <div className="mt-8">
            <Link href={`/projects/${flagshipVenture.slug}`} className="text-sm font-semibold text-signal hover:text-white active:text-white">
              {flagshipVenture.name} is the current flagship experiment →
            </Link>
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-graphite/60 py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <SectionHeading eyebrow="Proof of work" title="Research before claims.">
              <p>
                Computational superstition studies how reinforcement-learning agents preserve proxy rituals after
                reward conditions shift. It is the clearest current example of the thesis: agent behavior, emergence,
                and what happens once a pattern outlives the reason it existed.
              </p>
            </SectionHeading>
            <div className="grid gap-4">
              {writingPosts.slice(0, 2).map((post) => (
                <WritingCard key={post.slug} {...post} />
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <SectionHeading eyebrow="Podcast" title={podcast.name}>
              <p className="text-lg font-semibold text-signal">{podcast.tagline}</p>
              <p className="mt-4">{podcast.thesis}</p>
              <Link href="/podcast" className="mt-5 inline-flex text-sm font-semibold text-signal hover:text-white active:text-white">
                See the show
              </Link>
            </SectionHeading>
            <div className="rounded-lg border border-line bg-white/[0.035] p-7">
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-signal">The Intelligence Brief</p>
              <h3 className="mt-4 text-2xl font-semibold text-white">
                Signal. Thesis. Experiment. Research. Question. Build.
              </h3>
              <p className="mt-4 text-sm leading-6 text-steel">
                A recurring dispatch from the research territories: what we tested, what we learned, and what
                remains unresolved.
              </p>
              <NewsletterForm sourcePage="/" className="mt-6" />
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-graphite/60 py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHeading eyebrow="Founder" title="Why this founder, why these problems.">
              <p>{founderProfile.thesis}</p>
              <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold">
                <Link href="/people/mfoniso-jackson" className="text-signal hover:text-white active:text-white">
                  View founder node
                </Link>
                <Link href="/investors" className="text-signal hover:text-white active:text-white">
                  Read the investor brief
                </Link>
              </div>
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

      <section className="border-t border-line bg-graphite/70 py-20">
        <Container>
          <SalesCtaGroup
            sourcePage="/"
            title="Explore further, or start a conversation."
            description="Researchers, builders, investors, and grant organisations can request the appropriate public or confidential path."
          />
        </Container>
      </section>
    </>
  );
}
