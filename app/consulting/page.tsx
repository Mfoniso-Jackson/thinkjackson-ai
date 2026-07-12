import type { Metadata } from "next";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { consultingOffers } from "@/data/site";

export const metadata: Metadata = {
  title: "Consulting",
  description:
    "AI strategy, financial engineering systems, agent architecture, Web3 product strategy, and research-to-product execution."
};

export default function ConsultingPage() {
  return (
    <>
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <div className="max-w-4xl">
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-signal">Consulting</p>
              <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                Technical strategy for teams building where AI capability meets economic reality.
              </h1>
              <p className="mt-7 text-lg leading-8 text-steel">
                Mfoniso works with founders, funds, research teams, and product leaders
                who need rigorous AI systems thinking rather than trend-chasing theater.
              </p>
              <div className="mt-9">
                <Button href="/contact?intent=consulting&sourcePage=/consulting&campaign=consulting-hero-cta">
                  Start a conversation
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-y border-line bg-graphite/60 py-20">
        <Container>
          <SectionHeading eyebrow="Engagement areas" title="Where the work fits." />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {consultingOffers.map((offer, index) => (
              <Reveal key={offer} delay={index * 0.05}>
                <div className="rounded-lg border border-line bg-white/[0.035] p-6">
                  <p className="font-mono text-xs text-signal">0{index + 1}</p>
                  <h2 className="mt-4 text-xl font-semibold leading-7 text-white">{offer}</h2>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
