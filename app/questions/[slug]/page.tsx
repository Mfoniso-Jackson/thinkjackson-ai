import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { RelatedNodes } from "@/components/related-nodes";
import { CTASection } from "@/components/cta-section";
import { resolveNodeHybrid } from "@/lib/graph/hybrid";

export const dynamic = "force-dynamic";

type QuestionPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: QuestionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const node = await resolveNodeHybrid({ type: "question", slug });
  if (!node) return {};

  return {
    title: node.title,
    description: node.title,
    alternates: { canonical: `/questions/${slug}` }
  };
}

export default async function QuestionDetailPage({ params }: QuestionPageProps) {
  const { slug } = await params;
  const node = await resolveNodeHybrid({ type: "question", slug });

  if (!node) {
    notFound();
  }

  return (
    <>
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <Link href="/questions" className="font-mono text-xs uppercase tracking-[0.24em] text-signal hover:text-white active:text-white">
              Questions
            </Link>
            <div className="mt-8 max-w-4xl">
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-signal">Open question</p>
              <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {node.title}
              </h1>
            </div>
          </Reveal>
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
