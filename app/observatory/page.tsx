import type { Metadata } from "next";
import { Container } from "@/components/container";
import { NodeCard } from "@/components/node-card";
import { Reveal } from "@/components/reveal";
import { CTASection } from "@/components/cta-section";
import { countPublishedRelationships, listAllPublishedNodes } from "@/lib/kg-store";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Observatory",
  description:
    "A real record of ThinkJackson's research pipeline — every source reviewed, connection discovered, and question raised, in the order it actually happened.",
  alternates: {
    canonical: "/observatory"
  }
};

const discoverableTypes = new Set(["resource", "paper", "technology", "dataset", "experiment"]);

const typeEyebrows: Record<string, string> = {
  resource: "Discovered resource",
  paper: "Discovered paper",
  technology: "Discovered technology",
  dataset: "Discovered dataset",
  experiment: "Discovered experiment",
  question: "Open question",
  prediction: "Prediction"
};

function hrefFor(node: { type: string; slug: string; metadata: Record<string, unknown> }): string {
  if (node.type === "question") return `/questions/${node.slug}`;
  if (node.type === "prediction") return `/predictions/${node.slug}`;
  return typeof node.metadata.url === "string" ? node.metadata.url : "#";
}

/**
 * The admin-only /admin/research/activity page (model names, latency,
 * raw error strings) is built for the person running the pipeline. This
 * page is for everyone else — the same underlying facts, reframed as what
 * a visitor actually cares about: what got reviewed, what got connected,
 * what's still an open question. No vendor names, no failure logs — those
 * are operational detail, not the point of a public research record.
 */
export default async function ObservatoryPage() {
  const [nodes, relationshipCount] = await Promise.all([listAllPublishedNodes(50), countPublishedRelationships()]);

  const sourcesReviewed = nodes.filter((node) => discoverableTypes.has(node.type)).length;
  const questionsRaised = nodes.filter((node) => node.type === "question").length;

  const stats = [
    ["Sources reviewed", sourcesReviewed],
    ["Connections discovered", relationshipCount],
    ["Open questions raised", questionsRaised]
  ] as const;

  return (
    <>
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <div className="max-w-4xl">
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-signal">Observatory</p>
              <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                A real record, not a highlight reel.
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-steel">
                Every entry below came from ThinkJackson&apos;s actual research pipeline — a human pointed Scout at a
                real source, Researcher proposed real connections, and a human approved what you see here before it
                became part of the graph. Nothing on this page is a projection.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-y border-line bg-graphite/60 py-16">
        <Container>
          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map(([label, value]) => (
              <div key={label} className="rounded-lg border border-line bg-white/[0.035] p-6">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-steel">{label}</p>
                <p className="mt-3 text-4xl font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">Recent activity</p>
          {nodes.length === 0 ? (
            <div className="mt-8 rounded-lg border border-dashed border-line bg-white/[0.02] p-8 text-sm leading-6 text-steel">
              No published research yet. Check back once the discovery pipeline has run.
            </div>
          ) : (
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {nodes.map((node, index) => (
                <Reveal key={node.id} delay={index * 0.03}>
                  <NodeCard
                    href={hrefFor(node)}
                    eyebrow={typeEyebrows[node.type] ?? "Discovered resource"}
                    title={node.title}
                    summary={node.summary}
                    footer={formatDate(node.createdAt)}
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
