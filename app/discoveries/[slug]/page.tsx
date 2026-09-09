import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { RelatedNodes } from "@/components/related-nodes";
import { CTASection } from "@/components/cta-section";
import { getDiscoveredNode } from "@/lib/kg-store";
import type { NodeType } from "@/lib/graph/types";

export const dynamic = "force-dynamic";

type DiscoveryPageProps = {
  params: Promise<{ slug: string }>;
};

const typeEyebrows: Record<string, string> = {
  resource: "Discovered resource",
  paper: "Discovered paper",
  technology: "Discovered technology",
  dataset: "Discovered dataset",
  experiment: "Discovered experiment"
};

export async function generateMetadata({ params }: DiscoveryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const node = await getDiscoveredNode(slug);
  if (!node) return {};

  return {
    title: node.title,
    description: node.summary,
    alternates: { canonical: `/discoveries/${slug}` }
  };
}

export default async function DiscoveryDetailPage({ params }: DiscoveryPageProps) {
  const { slug } = await params;
  const node = await getDiscoveredNode(slug);

  if (!node) {
    notFound();
  }

  const sourceUrl = typeof node.metadata.url === "string" ? node.metadata.url : undefined;

  return (
    <>
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <Link href="/discoveries" className="font-mono text-xs uppercase tracking-[0.24em] text-signal hover:text-white active:text-white">
              Discoveries
            </Link>
            <div className="mt-8 max-w-4xl">
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-signal">{typeEyebrows[node.type] ?? "Discovered resource"}</p>
              <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">{node.title}</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-steel">{node.summary}</p>
              {sourceUrl ? (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.18em] text-signal hover:text-white active:text-white"
                >
                  View original source →
                </a>
              ) : null}
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <RelatedNodes nodeRef={{ type: node.type as NodeType, slug }} heading="Connects to" />
        </Container>
      </section>

      <CTASection />
    </>
  );
}
