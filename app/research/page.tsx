import type { Metadata } from "next";
import { Container } from "@/components/container";
import { CTASection } from "@/components/cta-section";
import { ResearchCard } from "@/components/research-card";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { researchThemes } from "@/data/site";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Research themes across computational superstition, AI safety, autonomous trading agents, portfolio intelligence, and coordination systems."
};

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
                The work begins with reinforcement learning and expands outward into
                market systems, safety, portfolio cognition, and machine economies.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-y border-line bg-graphite/60 py-20">
        <Container>
          <SectionHeading eyebrow="Themes" title="Open research tracks." />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {researchThemes.map((theme, index) => (
              <Reveal key={theme.title} delay={index * 0.04}>
                <ResearchCard {...theme} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
      <CTASection />
    </>
  );
}
