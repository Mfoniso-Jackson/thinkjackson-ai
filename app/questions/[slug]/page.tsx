import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { RelatedNodes } from "@/components/related-nodes";
import { CTASection } from "@/components/cta-section";
import { getQuestionNode } from "@/lib/kg-store";
import type { OpenLoopStatus } from "@/lib/kg-types";

export const dynamic = "force-dynamic";

type QuestionPageProps = {
  params: Promise<{ slug: string }>;
};

const statusLabels: Record<OpenLoopStatus, string> = {
  open: "Open",
  investigating: "Investigating",
  resolved: "Resolved",
  abandoned: "Abandoned"
};

export async function generateMetadata({ params }: QuestionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const node = await getQuestionNode(slug);
  if (!node) return {};

  return {
    title: node.title,
    description: node.metadata.hypothesis ?? node.title,
    alternates: { canonical: `/questions/${slug}` }
  };
}

export default async function QuestionDetailPage({ params }: QuestionPageProps) {
  const { slug } = await params;
  const node = await getQuestionNode(slug);

  if (!node) {
    notFound();
  }

  const { status, hypothesis, evidenceSummary, nextAction } = node.metadata;

  return (
    <>
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <Link href="/questions" className="font-mono text-xs uppercase tracking-[0.24em] text-signal hover:text-white active:text-white">
              Questions
            </Link>
            <div className="mt-8 max-w-4xl">
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-signal">{statusLabels[status]}</p>
              <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {node.title}
              </h1>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="py-4">
        <Container>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-line bg-white/[0.035] p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-signal">Hypothesis</p>
              <p className="mt-2 text-sm leading-6 text-white">{hypothesis ?? "Not yet formed."}</p>
            </div>
            <div className="rounded-lg border border-line bg-white/[0.035] p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-signal">Evidence so far</p>
              <p className="mt-2 text-sm leading-6 text-white">{evidenceSummary ?? "None gathered yet."}</p>
            </div>
            <div className="rounded-lg border border-line bg-white/[0.035] p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-signal">Next action</p>
              <p className="mt-2 text-sm leading-6 text-white">{nextAction ?? "Not yet decided."}</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <RelatedNodes nodeRef={{ type: "question", slug }} heading="Raised by, and connected to" />
        </Container>
      </section>

      <CTASection />
    </>
  );
}
