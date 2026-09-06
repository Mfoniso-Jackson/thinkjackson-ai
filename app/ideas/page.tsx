import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { IdeaCard } from "@/components/idea-card";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { CTASection } from "@/components/cta-section";
import { ideasByTerritory, transIntelligence } from "@/data/ideas";
import { territories } from "@/data/territories";

export const metadata: Metadata = {
  title: "Ideas",
  description:
    "The idea map behind ThinkJackson: Trans-Intelligence, the five research territories, and the concepts that connect research, ventures, and writing.",
  alternates: {
    canonical: "/ideas"
  }
};

export default function IdeasPage() {
  return (
    <>
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <div className="max-w-4xl">
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-signal">Ideas</p>
              <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                {transIntelligence.title}
              </h1>
              <p className="mt-7 text-lg leading-8 text-steel">{transIntelligence.definition}</p>
              <div className="mt-8 flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-steel">
                {transIntelligence.chain.map((step, index) => (
                  <span key={step} className="flex items-center gap-2">
                    <span className="rounded-md border border-line bg-white/5 px-3 py-2 text-white">{step}</span>
                    {index < transIntelligence.chain.length - 1 ? (
                      <span aria-hidden="true" className="text-signal">
                        →
                      </span>
                    ) : null}
                  </span>
                ))}
              </div>
              <Link
                href="/ideas/trans-intelligence"
                className="mt-6 inline-flex text-sm font-semibold text-signal hover:text-white"
              >
                Read the full thesis
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      {territories.map((territory, territoryIndex) => {
        const territoryIdeas = ideasByTerritory(territory.slug);
        return (
          <section
            key={territory.slug}
            id={territory.slug}
            className={territoryIndex % 2 === 0 ? "border-y border-line bg-graphite/60 py-20" : "py-20"}
          >
            <Container>
              <SectionHeading eyebrow="Research territory" title={territory.name}>
                <p>{territory.definition}</p>
              </SectionHeading>
              {territoryIdeas.length > 0 ? (
                <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {territoryIdeas.map((idea, index) => (
                    <Reveal key={idea.slug} delay={index * 0.04}>
                      <IdeaCard idea={idea} />
                    </Reveal>
                  ))}
                </div>
              ) : (
                <p className="mt-8 text-sm leading-6 text-steel">
                  No ideas are indexed under this territory yet.
                </p>
              )}
            </Container>
          </section>
        );
      })}
      <CTASection />
    </>
  );
}
