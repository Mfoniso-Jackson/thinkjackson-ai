import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { CTASection } from "@/components/cta-section";
import { IdeaCard } from "@/components/idea-card";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { ideasByTerritory } from "@/data/ideas";
import { territories } from "@/data/territories";

export const metadata: Metadata = {
  title: "Research",
  description:
    "The research hierarchy behind ThinkJackson: posts, essays, research, experiments, open source, and the ideas they support across five territories.",
  alternates: {
    canonical: "/research"
  }
};

const hierarchy = [
  "Posts",
  "Essays",
  "Research",
  "Experiments",
  "Open source",
  "Podcasts",
  "Datasets",
  "Predictions",
  "Reports",
  "Products",
  "Ventures"
] as const;

export default function ResearchPage() {
  return (
    <>
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <div className="max-w-4xl">
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-signal">Research</p>
              <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                A research program for agents that learn, allocate, coordinate, and sometimes hallucinate causality.
              </h1>
              <p className="mt-7 text-lg leading-8 text-steel">
                Work moves in one direction: a post can become an essay, an essay can justify research, research can
                justify an experiment, and only proven experiments become products or ventures. Nothing skips a step.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-y border-line bg-graphite/60 py-16">
        <Container>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">Proof-of-work hierarchy</p>
          <div className="mt-6 flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-steel">
            {hierarchy.map((stage, index) => (
              <span key={stage} className="flex items-center gap-2">
                <span className="rounded-md border border-line bg-white/5 px-3 py-2 text-white">{stage}</span>
                {index < hierarchy.length - 1 ? (
                  <span aria-hidden="true" className="text-signal">
                    ↓
                  </span>
                ) : null}
              </span>
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-sm leading-6 text-steel">
            Every claim on this site is marked as fact, interpretation, hypothesis, prediction, or speculation.
            Intellectual honesty about which one applies matters more than sounding certain.
          </p>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionHeading eyebrow="Flagship research" title="Computational Superstition in Reinforcement Learning">
            <p>
              A research program studying proxy persistence, non-causal stabilization, and learned rituals in
              adaptive agents.
            </p>
          </SectionHeading>
          <Link
            href="/research/computational-superstition"
            className="mt-5 inline-flex text-sm font-semibold text-signal hover:text-white active:text-white"
          >
            Read the flagship research brief
          </Link>
        </Container>
      </section>

      {territories.map((territory, territoryIndex) => {
        const territoryIdeas = ideasByTerritory(territory.slug);
        if (territoryIdeas.length === 0) return null;

        return (
          <section
            key={territory.slug}
            id={territory.slug}
            className={territoryIndex % 2 === 0 ? "border-y border-line bg-graphite/60 py-20" : "py-20"}
          >
            <Container>
              <SectionHeading eyebrow="Territory" title={territory.name}>
                <p>{territory.definition}</p>
              </SectionHeading>
              <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {territoryIdeas.map((idea, index) => (
                  <Reveal key={idea.slug} delay={index * 0.04}>
                    <IdeaCard idea={idea} />
                  </Reveal>
                ))}
              </div>
            </Container>
          </section>
        );
      })}
      <CTASection />
    </>
  );
}
