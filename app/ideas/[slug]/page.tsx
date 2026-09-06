import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { RelatedNodes } from "@/components/related-nodes";
import { RelatedNodesGraph } from "@/components/related-nodes-graph";
import { SessionTrail } from "@/components/session-trail";
import { CTASection } from "@/components/cta-section";
import { getIdea, ideas, transIntelligence } from "@/data/ideas";
import { getTerritory } from "@/data/territories";
import { epistemicStatusLabels } from "@/lib/graph/types";

type IdeaPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return [{ slug: transIntelligence.slug }, ...ideas.map((idea) => ({ slug: idea.slug }))];
}

export async function generateMetadata({ params }: IdeaPageProps): Promise<Metadata> {
  const { slug } = await params;

  if (slug === transIntelligence.slug) {
    return {
      title: transIntelligence.title,
      description: transIntelligence.definition,
      alternates: { canonical: `/ideas/${slug}` }
    };
  }

  const idea = getIdea(slug);
  if (!idea) return {};

  return {
    title: idea.title,
    description: idea.summary,
    alternates: { canonical: `/ideas/${slug}` }
  };
}

export default async function IdeaDetailPage({ params }: IdeaPageProps) {
  const { slug } = await params;

  if (slug === transIntelligence.slug) {
    return <TransIntelligencePage />;
  }

  const idea = getIdea(slug);

  if (!idea) {
    notFound();
  }

  return (
    <>
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <Link href="/ideas" className="font-mono text-xs uppercase tracking-[0.24em] text-signal hover:text-white active:text-white">
              Ideas
            </Link>
            <div className="mt-8 max-w-4xl">
              <span className="rounded-md border border-line bg-white/5 px-3 py-2 font-mono text-xs text-steel">
                {epistemicStatusLabels[idea.status]}
              </span>
              <p className="mt-7 font-mono text-sm uppercase tracking-[0.3em] text-signal">{idea.eyebrow}</p>
              <h1 className="mt-5 text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                {idea.title}
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-steel">{idea.summary}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {idea.territorySlugs.map((territorySlug) => {
                  const territory = getTerritory(territorySlug);
                  if (!territory) return null;
                  return (
                    <Link
                      key={territorySlug}
                      href={`/research#${territorySlug}`}
                      className="rounded-md bg-signal/10 px-3 py-2 font-mono text-xs text-signal hover:bg-signal/20"
                    >
                      {territory.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {idea.openQuestions && idea.openQuestions.length > 0 ? (
        <section className="border-y border-line bg-graphite/60 py-20">
          <Container>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">Open questions</p>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {idea.openQuestions.map((question) => (
                <div key={question} className="rounded-lg border border-line bg-white/[0.035] p-5 text-sm leading-6 text-white">
                  {question}
                </div>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <section className="py-20">
        <Container>
          <div className="wide:hidden">
            <RelatedNodes nodeRef={{ type: "idea", slug: idea.slug }} heading="Connected across the graph" />
          </div>
          <div className="hidden wide:block">
            <p className="mb-8 text-center font-mono text-xs uppercase tracking-[0.28em] text-signal">
              Connected across the graph
            </p>
            <RelatedNodesGraph nodeRef={{ type: "idea", slug: idea.slug }} centerLabel={idea.title} />
          </div>
          <div className="mt-8">
            <SessionTrail node={{ type: "idea", slug: idea.slug, title: idea.title, href: `/ideas/${idea.slug}` }} />
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
}

function TransIntelligencePage() {
  return (
    <>
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <Link href="/ideas" className="font-mono text-xs uppercase tracking-[0.24em] text-signal hover:text-white active:text-white">
              Ideas
            </Link>
            <div className="mt-8 max-w-4xl">
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-signal">Core thesis</p>
              <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                {transIntelligence.title}
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-steel">{transIntelligence.definition}</p>
              <p className="mt-6 max-w-3xl text-base leading-7 text-steel">{transIntelligence.summary}</p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-y border-line bg-graphite/60 py-16">
        <Container>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">The transition</p>
          <div className="mt-6 flex flex-wrap items-center gap-2 font-mono text-sm uppercase tracking-[0.18em] text-steel">
            {transIntelligence.chain.map((step, index) => (
              <span key={step} className="flex items-center gap-2">
                <span className="rounded-md border border-line bg-white/5 px-4 py-3 text-white">{step}</span>
                {index < transIntelligence.chain.length - 1 ? (
                  <span aria-hidden="true" className="text-signal">
                    →
                  </span>
                ) : null}
              </span>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="wide:hidden">
            <RelatedNodes
              nodeRef={{ type: "idea", slug: transIntelligence.slug }}
              heading="Where the thesis is observable now"
            />
          </div>
          <div className="hidden wide:block">
            <p className="mb-8 text-center font-mono text-xs uppercase tracking-[0.28em] text-signal">
              Where the thesis is observable now
            </p>
            <RelatedNodesGraph
              nodeRef={{ type: "idea", slug: transIntelligence.slug }}
              centerLabel={transIntelligence.title}
            />
          </div>
          <div className="mt-8">
            <SessionTrail
              node={{
                type: "idea",
                slug: transIntelligence.slug,
                title: transIntelligence.title,
                href: `/ideas/${transIntelligence.slug}`
              }}
            />
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
