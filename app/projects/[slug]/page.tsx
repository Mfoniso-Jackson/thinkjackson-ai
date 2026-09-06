import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnalyticsMarker } from "@/components/analytics-marker";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { SalesCtaGroup } from "@/components/sales-cta";
import { RelatedNodes } from "@/components/related-nodes";
import { RelatedNodesGraph } from "@/components/related-nodes-graph";
import { SessionTrail } from "@/components/session-trail";
import { capitalObjectiveLabels, publicVentures } from "@/data/ventures";
import { secondDegreeRefs } from "@/lib/graph/registry";
import { resolveNode } from "@/lib/graph/resolve";
import { verifiedEvidence } from "@/lib/venture-validation";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return publicVentures.map((venture) => ({ slug: venture.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const venture = publicVentures.find((item) => item.slug === slug);

  if (!venture) {
    return {};
  }

  return {
    title: venture.name,
    description: venture.tagline,
    alternates: {
      canonical: `/projects/${venture.slug}`
    },
    openGraph: {
      title: `${venture.name} | ThinkJackson`,
      description: venture.tagline,
      url: `https://thinkjackson.com/projects/${venture.slug}`
    }
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const venture = publicVentures.find((item) => item.slug === slug);

  if (!venture) {
    notFound();
  }

  const relatedPosts = secondDegreeRefs({ type: "venture", slug: venture.slug }, "essay")
    .map((ref) => resolveNode(ref))
    .filter((node) => node !== undefined);
  const evidence = verifiedEvidence(venture);

  return (
    <>
      <AnalyticsMarker event={venture.flagship ? "flagship_venture_viewed" : "venture_page_viewed"} properties={{ venture: venture.slug }} />
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <Link href="/projects" className="font-mono text-xs uppercase tracking-[0.24em] text-signal hover:text-white active:text-white">
              Ventures
            </Link>
            <div className="mt-8 max-w-5xl">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-md border border-line bg-white/5 px-3 py-2 font-mono text-xs text-steel">{venture.statusLabel}</span>
                {venture.flagship ? (
                  <span className="rounded-md bg-signal/10 px-3 py-2 font-mono text-xs text-signal">Flagship venture</span>
                ) : null}
              </div>
              <p className="mt-7 font-mono text-sm uppercase tracking-[0.3em] text-volt">{venture.category}</p>
              <h1 className="mt-5 text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                {venture.name}
              </h1>
              <p className="mt-5 max-w-4xl text-2xl font-semibold leading-9 text-signal">{venture.tagline}</p>
              <p className="mt-6 max-w-4xl text-lg leading-8 text-steel">{venture.investmentThesis}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href={`/contact?intent=investor&venture=${venture.slug}&sourcePage=/projects/${venture.slug}&campaign=${venture.slug}-hero-materials`}>
                  Request materials
                </Button>
                <Button href={`/projects/${venture.slug}/deck`} variant="secondary">
                  View pitch deck
                </Button>
                {venture.websiteUrl ? (
                  <Button href={venture.websiteUrl} variant="secondary">
                    Visit website
                  </Button>
                ) : null}
                {venture.repositoryUrl ? (
                  <Button href={venture.repositoryUrl} variant="secondary">
                    View repository
                  </Button>
                ) : null}
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-y border-line bg-graphite/60 py-20">
        <Container>
          <div className="grid gap-5 lg:grid-cols-3">
            {[
              ["Problem", venture.problem],
              ["Target customer", venture.targetCustomer],
              ["Current alternative", venture.currentAlternative]
            ].map(([label, copy]) => (
              <div key={label} className="rounded-lg border border-line bg-white/[0.035] p-6">
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-signal">{label}</p>
                <p className="mt-4 text-sm leading-7 text-steel">{copy}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <SectionHeading eyebrow="Product and architecture" title="Current capability and planned direction are separated.">
              <p>{venture.solution}</p>
            </SectionHeading>
            <div className="grid gap-3">
              {venture.differentiation.map((item) => (
                <div key={item} className="rounded-lg border border-line bg-white/[0.035] p-5 text-sm leading-6 text-steel">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-graphite/60 py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">Defensibility</p>
              <div className="mt-6 space-y-3">
                {venture.defensibility.map((item) => (
                  <div key={item} className="rounded-lg border border-line bg-white/[0.035] p-5 text-sm leading-6 text-steel">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">Market entry wedge</p>
              <p className="mt-6 text-lg leading-8 text-white">{venture.marketEntry}</p>
              <p className="mt-8 font-mono text-xs uppercase tracking-[0.28em] text-signal">Business model paths</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {venture.businessModel.map((item) => (
                  <span key={item} className="rounded-md border border-line bg-white/5 px-3 py-2 text-sm text-steel">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">Verified progress</p>
              <div className="mt-6 space-y-4">
                {evidence.length > 0 ? (
                  evidence.map((item) => (
                    <Link
                      key={item.label}
                      href={item.url ?? `/projects/${venture.slug}`}
                      target={item.url?.startsWith("http") ? "_blank" : undefined}
                      rel={item.url?.startsWith("http") ? "noreferrer" : undefined}
                      className="block rounded-lg border border-line bg-white/[0.035] p-5 transition hover:border-signal/35 active:border-signal/50"
                    >
                      {item.date ? (
                        <time className="font-mono text-xs uppercase tracking-[0.18em] text-signal" dateTime={item.date}>
                          {item.date}
                        </time>
                      ) : null}
                      <h3 className="text-lg font-semibold text-white">{item.label}</h3>
                      <p className="mt-2 text-sm leading-6 text-steel">{item.description}</p>
                    </Link>
                  ))
                ) : (
                  <div className="rounded-lg border border-line bg-white/[0.035] p-5 text-sm leading-6 text-steel">
                    Public evidence is still being assembled. Founder input is required before stronger proof claims are shown.
                  </div>
                )}
              </div>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">Next milestones</p>
              <div className="mt-6 space-y-3">
                {venture.milestones.map((item, index) => (
                  <div key={item} className="rounded-lg border border-line bg-white/[0.035] p-5">
                    <p className="font-mono text-xs text-volt">0{index + 1}</p>
                    <p className="mt-3 text-sm leading-6 text-steel">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-graphite/60 py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">Capital or partnership objective</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">{venture.currentAsk}</h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {venture.capitalObjectives.map((objective) => (
                  <span key={objective} className="rounded-md bg-signal/10 px-3 py-2 font-mono text-xs text-signal">
                    {capitalObjectiveLabels[objective]}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">Risks and open questions</p>
              <div className="mt-6 space-y-3">
                {venture.risks.map((risk) => (
                  <div key={risk} className="rounded-lg border border-line bg-white/[0.035] p-5 text-sm leading-6 text-steel">
                    {risk}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHeading eyebrow="Founder advantage" title="Why this belongs in the portfolio.">
              <p>{venture.founderAdvantage}</p>
            </SectionHeading>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">Related writing</p>
              {relatedPosts.length > 0 ? (
                <div className="mt-6 grid gap-4">
                  {relatedPosts.map((post) => (
                    <Link key={post!.href} href={post!.href} className="rounded-lg border border-line bg-white/[0.035] p-5 transition hover:border-signal/35 active:border-signal/50">
                      <h3 className="text-lg font-semibold text-white">{post!.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-steel">{post!.summary}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="mt-6 text-sm leading-6 text-steel">No essays are indexed against this venture yet.</p>
              )}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="wide:hidden">
            <RelatedNodes nodeRef={{ type: "venture", slug: venture.slug }} heading="This venture in the idea graph" />
          </div>
          <div className="hidden wide:block">
            <p className="mb-8 text-center font-mono text-xs uppercase tracking-[0.28em] text-signal">
              This venture in the idea graph
            </p>
            <RelatedNodesGraph nodeRef={{ type: "venture", slug: venture.slug }} centerLabel={venture.name} />
          </div>
          <div className="mt-8">
            <SessionTrail node={{ type: "venture", slug: venture.slug, title: venture.name, href: `/projects/${venture.slug}` }} />
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-graphite/60 py-20">
        <Container>
          <div className="grid gap-5 lg:grid-cols-3">
            <Link
              href={`/projects/${venture.slug}/deck`}
              className="rounded-lg border border-line bg-white/[0.035] p-6 transition hover:border-signal/35 active:border-signal/50"
            >
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-signal">Pitch deck</p>
              <h2 className="mt-4 text-xl font-semibold text-white">Open the venture deck</h2>
              <p className="mt-3 text-sm leading-6 text-steel">
                A concise investor and partner narrative generated from the current venture brief.
              </p>
            </Link>
            {venture.websiteUrl ? (
              <Link
                href={venture.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-line bg-white/[0.035] p-6 transition hover:border-signal/35 active:border-signal/50"
              >
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-signal">Website</p>
                <h2 className="mt-4 text-xl font-semibold text-white">Visit project website</h2>
                <p className="mt-3 text-sm leading-6 text-steel">
                  Open the public product or research website for this project.
                </p>
              </Link>
            ) : null}
            {venture.demoUrl ? (
              <Link
                href={venture.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-line bg-white/[0.035] p-6 transition hover:border-signal/35 active:border-signal/50"
              >
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-signal">Demo</p>
                <h2 className="mt-4 text-xl font-semibold text-white">Open project demo</h2>
                <p className="mt-3 text-sm leading-6 text-steel">
                  Inspect the current public demo surface where available.
                </p>
              </Link>
            ) : null}
          </div>
        </Container>
      </section>

      <section className="border-t border-line bg-graphite/70 py-20">
        <Container>
          <SalesCtaGroup
            sourcePage={`/projects/${venture.slug}`}
            ventureSlug={venture.slug}
            title="Qualified diligence starts with the right path."
            description="Public venture pages do not expose confidential decks, financial models, cap tables, private repositories, or sensitive technical material. Choose the route that matches your interest."
          />
        </Container>
      </section>
    </>
  );
}
