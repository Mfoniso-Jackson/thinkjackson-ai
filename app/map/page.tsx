import type { Metadata } from "next";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { CTASection } from "@/components/cta-section";
import { TransIntelligenceMap } from "@/components/trans-intelligence-map";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Trans-Intelligence Map",
  description:
    "Every idea, territory, venture, essay, and discovery ThinkJackson has published, laid out by the real connections between them — not a curated diagram.",
  alternates: {
    canonical: "/map"
  }
};

export default function MapPage() {
  return (
    <>
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <div className="max-w-4xl">
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-signal">Trans-Intelligence Map</p>
              <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                The whole graph, not a curated diagram.
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-steel">
                Every node here is real and clickable — grouped by the research territory it&apos;s closest to, connected
                by the same relationships that power every related-content panel on the site. A line crossing from one
                cluster to another is a real connection between territories, which is the whole point of
                Trans-Intelligence: capability distributing across boundaries, not staying inside one discipline.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-y border-line bg-graphite/60 py-20">
        <Container>
          <TransIntelligenceMap />
        </Container>
      </section>
      <CTASection />
    </>
  );
}
