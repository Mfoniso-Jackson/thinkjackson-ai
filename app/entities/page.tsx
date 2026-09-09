import type { Metadata } from "next";
import { Container } from "@/components/container";
import { NodeCard } from "@/components/node-card";
import { Reveal } from "@/components/reveal";
import { CTASection } from "@/components/cta-section";
import { listEntities } from "@/lib/kg-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Entities",
  description:
    "The people, companies, technologies, and projects ThinkJackson's research keeps encountering — resolved to one canonical node per entity, with every claim traceable to its source.",
  alternates: {
    canonical: "/entities"
  }
};

const entityTypeEyebrows: Record<string, string> = {
  person: "Person",
  company: "Company",
  technology: "Technology",
  project: "Project"
};

export default async function EntitiesPage() {
  const entities = await listEntities();

  return (
    <>
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <div className="max-w-4xl">
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-signal">Entities</p>
              <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                Who and what keeps showing up.
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-steel">
                Every person, company, technology, and project ThinkJackson&apos;s research mentions is resolved to one
                canonical node here — not a new record every time a name reappears. Each entity&apos;s page shows exactly
                which claims ThinkJackson holds about it, and where each one came from.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-y border-line bg-graphite/60 py-20">
        <Container>
          {entities.length === 0 ? (
            <div className="rounded-lg border border-dashed border-line bg-white/[0.02] p-8 text-sm leading-6 text-steel">
              No entities yet. They&apos;re resolved from real, approved research as it&apos;s published — check back once the
              discovery pipeline has run.
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {entities.map((entity, index) => (
                <Reveal key={entity.slug} delay={index * 0.04}>
                  <NodeCard
                    href={`/entities/${entity.slug}`}
                    eyebrow={entityTypeEyebrows[entity.entityType] ?? "Entity"}
                    title={entity.canonicalName}
                    summary={entity.description ?? "See the claims ThinkJackson holds about this entity and their sources."}
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
