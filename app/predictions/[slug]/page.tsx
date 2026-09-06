import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { RelatedNodes } from "@/components/related-nodes";
import { CTASection } from "@/components/cta-section";
import { resolveNodeHybrid } from "@/lib/graph/hybrid";
import { listPublishedNodesByType } from "@/lib/kg-store";

export const dynamic = "force-dynamic";

type PredictionPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PredictionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const node = await resolveNodeHybrid({ type: "prediction", slug });
  if (!node) return {};

  return {
    title: node.title,
    description: node.title,
    alternates: { canonical: `/predictions/${slug}` }
  };
}

export default async function PredictionDetailPage({ params }: PredictionPageProps) {
  const { slug } = await params;
  const [node, predictions] = await Promise.all([
    resolveNodeHybrid({ type: "prediction", slug }),
    listPublishedNodesByType("prediction")
  ]);

  if (!node) {
    notFound();
  }

  const record = predictions.find((prediction) => prediction.slug === slug);
  const rationale = typeof record?.metadata.rationale === "string" ? record.metadata.rationale : undefined;
  const status = typeof record?.metadata.resolutionStatus === "string" ? record.metadata.resolutionStatus : "unresolved";
  const createdAt = record?.createdAt;

  return (
    <>
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <Link href="/predictions" className="font-mono text-xs uppercase tracking-[0.24em] text-signal hover:text-white active:text-white">
              Predictions
            </Link>
            <div className="mt-8 max-w-4xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-md border border-line bg-white/5 px-3 py-2 font-mono text-xs uppercase tracking-[0.14em] text-steel">
                  {status}
                </span>
                {createdAt ? (
                  <time dateTime={createdAt} className="font-mono text-xs text-steel">
                    Recorded {new Date(createdAt).toLocaleDateString("en", { year: "numeric", month: "short", day: "numeric" })}
                  </time>
                ) : null}
              </div>
              <p className="mt-7 font-mono text-sm uppercase tracking-[0.3em] text-signal">Prediction</p>
              <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {node.title}
              </h1>
              {rationale ? <p className="mt-7 max-w-3xl text-lg leading-8 text-steel">{rationale}</p> : null}
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <RelatedNodes nodeRef={{ type: "prediction", slug }} heading="Derived from" />
        </Container>
      </section>

      <CTASection />
    </>
  );
}
