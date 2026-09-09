import type { Metadata } from "next";
import { Container } from "@/components/container";
import { NodeCard } from "@/components/node-card";
import { Reveal } from "@/components/reveal";
import { CTASection } from "@/components/cta-section";
import { listDiscoveredNodes } from "@/lib/kg-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Discoveries",
  description:
    "Every source ThinkJackson's research pipeline has reviewed and published — papers, technologies, datasets, experiments, and general resources, each connected to the ideas, territories, and entities it touches.",
  alternates: {
    canonical: "/discoveries"
  }
};

const typeEyebrows: Record<string, string> = {
  resource: "Discovered resource",
  paper: "Discovered paper",
  technology: "Discovered technology",
  dataset: "Discovered dataset",
  experiment: "Discovered experiment"
};

export default async function DiscoveriesPage() {
  const nodes = await listDiscoveredNodes();

  return (
    <>
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <div className="max-w-4xl">
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-signal">Discoveries</p>
              <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                What the research pipeline found.
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-steel">
                Every source here passed through Scout, Researcher, and Librarian, then a human review, before
                publication. Each one connects outward — to the ideas and territories it touches, and to the people,
                companies, and technologies it mentions.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-y border-line bg-graphite/60 py-20">
        <Container>
          {nodes.length === 0 ? (
            <div className="rounded-lg border border-dashed border-line bg-white/[0.02] p-8 text-sm leading-6 text-steel">
              No discoveries published yet — check back once the discovery pipeline has run and a human has approved
              a candidate.
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {nodes.map((node, index) => (
                <Reveal key={node.slug} delay={index * 0.04}>
                  <NodeCard
                    href={`/discoveries/${node.slug}`}
                    eyebrow={typeEyebrows[node.type] ?? "Discovered resource"}
                    title={node.title}
                    summary={node.summary}
                  />
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </section>
      <CTASection />
    </>
  );
}
