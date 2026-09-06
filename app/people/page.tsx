import type { Metadata } from "next";
import { Container } from "@/components/container";
import { NodeCard } from "@/components/node-card";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { CTASection } from "@/components/cta-section";
import { people } from "@/data/people";

export const metadata: Metadata = {
  title: "People",
  description: "The people network behind ThinkJackson: who is building, what they research, and how it connects.",
  alternates: {
    canonical: "/people"
  }
};

export default function PeoplePage() {
  return (
    <>
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <div className="max-w-4xl">
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-signal">People</p>
              <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                The people shaping this thesis.
              </h1>
              <p className="mt-7 text-lg leading-8 text-steel">
                ThinkJackson prioritizes intellectual relevance over headcount. This network grows as real research
                collaborators, podcast guests, and co-builders join — not before.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-y border-line bg-graphite/60 py-20">
        <Container>
          <SectionHeading eyebrow="Network" title="Currently indexed." />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {people.map((person, index) => (
              <Reveal key={person.slug} delay={index * 0.04}>
                <NodeCard
                  href={`/people/${person.slug}`}
                  eyebrow={person.role}
                  title={person.name}
                  summary={person.summary}
                  titleSize="lg"
                />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
      <CTASection />
    </>
  );
}
