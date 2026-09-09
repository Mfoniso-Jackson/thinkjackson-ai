import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { CTASection } from "@/components/cta-section";
import { epistemicStatusLabels } from "@/lib/graph/types";
import { getEntity, listClaimsForEntity } from "@/lib/kg-store";

export const dynamic = "force-dynamic";

type EntityPageProps = {
  params: Promise<{ slug: string }>;
};

const entityTypeEyebrows: Record<string, string> = {
  person: "Person",
  company: "Company",
  technology: "Technology",
  project: "Project"
};

export async function generateMetadata({ params }: EntityPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entity = await getEntity(slug);
  if (!entity) return {};

  return {
    title: entity.canonicalName,
    description: entity.description ?? `Claims ThinkJackson holds about ${entity.canonicalName}, with sources.`,
    alternates: { canonical: `/entities/${slug}` }
  };
}

export default async function EntityDetailPage({ params }: EntityPageProps) {
  const { slug } = await params;
  const entity = await getEntity(slug);

  if (!entity) {
    notFound();
  }

  const claims = await listClaimsForEntity(slug);

  return (
    <>
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <Link href="/entities" className="font-mono text-xs uppercase tracking-[0.24em] text-signal hover:text-white active:text-white">
              Entities
            </Link>
            <div className="mt-8 max-w-4xl">
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-signal">
                {entityTypeEyebrows[entity.entityType] ?? "Entity"}
              </p>
              <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {entity.canonicalName}
              </h1>
              {entity.description ? <p className="mt-6 max-w-3xl text-lg leading-8 text-steel">{entity.description}</p> : null}
              {entity.aliases.length > 0 ? (
                <p className="mt-4 text-sm text-steel">Also referred to as: {entity.aliases.join(", ")}</p>
              ) : null}
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-y border-line bg-graphite/60 py-20">
        <Container>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">
            {claims.length === 0 ? "No claims yet" : `${claims.length} claim${claims.length === 1 ? "" : "s"}, with sources`}
          </p>

          {claims.length === 0 ? (
            <div className="mt-6 rounded-lg border border-dashed border-line bg-white/[0.02] p-8 text-sm leading-6 text-steel">
              ThinkJackson hasn&apos;t published a claim connected to this entity yet — it was resolved from a
              discovery still under review, or one whose claims didn&apos;t survive to publication.
            </div>
          ) : (
            <div className="mt-6 grid gap-4">
              {claims.map((claim) => (
                <div key={claim.id} className="rounded-lg border border-line bg-white/[0.035] p-5">
                  <span className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-white">
                    {epistemicStatusLabels[claim.epistemicStatus] ?? claim.epistemicStatus}
                  </span>
                  <p className="mt-3 text-base leading-6 text-white">{claim.statement}</p>
                  {claim.evidence ? (
                    <p className="mt-3 text-sm leading-6 text-steel">&ldquo;{claim.evidence}&rdquo;</p>
                  ) : null}
                  <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-steel">
                    From{" "}
                    {claim.sourceUrl ? (
                      <a href={claim.sourceUrl} target="_blank" rel="noreferrer" className="text-signal hover:text-white">
                        {claim.nodeTitle}
                      </a>
                    ) : (
                      claim.nodeTitle
                    )}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>

      <CTASection />
    </>
  );
}
