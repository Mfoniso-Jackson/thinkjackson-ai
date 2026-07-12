import type { Metadata } from "next";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { VentureCard } from "@/components/venture-card";
import { publicVentures } from "@/data/ventures";

export const metadata: Metadata = {
  title: "Ventures",
  description:
    "Investor-readable venture portfolio across autonomous markets, quant infrastructure, recognition, property intelligence, security operations, crypto risk, and AI safety research.",
  alternates: {
    canonical: "/projects"
  }
};

export default function ProjectsPage() {
  return (
    <>
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <div className="max-w-4xl">
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-signal">Ventures</p>
              <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                Venture systems for intelligence, capital, trust, and adaptive decision-making.
              </h1>
              <p className="mt-7 text-lg leading-8 text-steel">
                Each venture is a commercial surface for the same technical thesis: decision and coordination
                infrastructure for environments where risk, incentives, data, and agents interact.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/investors">Read investor brief</Button>
                <Button href="/investors#request" variant="secondary">
                  Request materials
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-y border-line bg-graphite/60 py-20">
        <Container>
          <SectionHeading eyebrow="Portfolio map" title="Stage, objective, and evidence are separated on purpose.">
            <p>
              These pages distinguish current capability from planned capability. No revenue, customer, pilot,
              performance, or fundraising metrics are shown without verified public evidence.
            </p>
          </SectionHeading>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {publicVentures.map((venture, index) => (
              <Reveal key={venture.slug} delay={index * 0.04}>
                <VentureCard venture={venture} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
