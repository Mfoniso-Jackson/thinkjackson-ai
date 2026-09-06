import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { capitalObjectiveLabels, publicVentures } from "@/data/ventures";
import { verifiedEvidence } from "@/lib/venture-validation";

type ProjectDeckPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return publicVentures.map((venture) => ({ slug: venture.slug }));
}

export async function generateMetadata({ params }: ProjectDeckPageProps): Promise<Metadata> {
  const { slug } = await params;
  const venture = publicVentures.find((item) => item.slug === slug);

  if (!venture) {
    return {};
  }

  return {
    title: `${venture.name} Pitch Deck`,
    description: `Pitch deck for ${venture.name}: ${venture.tagline}`,
    alternates: {
      canonical: `/projects/${venture.slug}/deck`
    },
    openGraph: {
      title: `${venture.name} Pitch Deck | ThinkJackson`,
      description: venture.tagline,
      url: `https://thinkjackson.com/projects/${venture.slug}/deck`
    }
  };
}

function DeckSlide({
  eyebrow,
  title,
  children
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="min-h-[70vh] border-t border-line py-16 first:border-t-0 sm:py-20">
      <Reveal>
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">{eyebrow}</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
          </div>
          <div className="text-base leading-7 text-steel">{children}</div>
        </div>
      </Reveal>
    </section>
  );
}

function BulletGrid({ items }: { items: readonly string[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item} className="rounded-lg border border-line bg-white/[0.035] p-4 text-sm leading-6 text-steel">
          {item}
        </div>
      ))}
    </div>
  );
}

export default async function ProjectDeckPage({ params }: ProjectDeckPageProps) {
  const { slug } = await params;
  const venture = publicVentures.find((item) => item.slug === slug);

  if (!venture) {
    notFound();
  }

  const evidence = verifiedEvidence(venture);

  return (
    <main className="py-20 sm:py-24">
      <Container>
        <Reveal>
          <Link href={`/projects/${venture.slug}`} className="font-mono text-xs uppercase tracking-[0.24em] text-signal hover:text-white">
            Back to venture brief
          </Link>
          <div className="mt-8 max-w-5xl">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-md border border-line bg-white/5 px-3 py-2 font-mono text-xs text-steel">
                Pitch deck
              </span>
              <span className="rounded-md border border-line bg-white/5 px-3 py-2 font-mono text-xs text-steel">
                {venture.statusLabel}
              </span>
              {venture.flagship ? (
                <span className="rounded-md bg-signal/10 px-3 py-2 font-mono text-xs text-signal">
                  Flagship venture
                </span>
              ) : null}
            </div>
            <p className="mt-7 font-mono text-sm uppercase tracking-[0.3em] text-volt">{venture.category}</p>
            <h1 className="mt-5 text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl">
              {venture.name}
            </h1>
            <p className="mt-5 max-w-4xl text-2xl font-semibold leading-9 text-signal">{venture.tagline}</p>
            <p className="mt-6 max-w-4xl text-lg leading-8 text-steel">
              This is a web-native deck generated from the current venture data. It is designed for investor,
              partner, grant, and design-partner conversations without exposing confidential materials.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href={`/contact?intent=investor&venture=${venture.slug}&sourcePage=/projects/${venture.slug}/deck&campaign=${venture.slug}-deck-materials`}>
                Request materials
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

        <DeckSlide eyebrow="01 / Thesis" title="Why this should exist.">
          <p className="text-xl leading-8 text-white">{venture.investmentThesis}</p>
          <p className="mt-6">{venture.founderAdvantage}</p>
        </DeckSlide>

        <DeckSlide eyebrow="02 / Problem" title="The market friction.">
          <p className="text-lg leading-8 text-white">{venture.problem}</p>
          <div className="mt-8 rounded-lg border border-line bg-white/[0.035] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-signal">Current alternative</p>
            <p className="mt-3 text-sm leading-6 text-steel">{venture.currentAlternative}</p>
          </div>
        </DeckSlide>

        <DeckSlide eyebrow="03 / Solution" title="The operating system being built.">
          <p className="text-lg leading-8 text-white">{venture.solution}</p>
          <div className="mt-8">
            <BulletGrid items={venture.differentiation} />
          </div>
        </DeckSlide>

        <DeckSlide eyebrow="04 / Customer" title="Who this is for.">
          <p className="text-xl leading-8 text-white">{venture.targetCustomer}</p>
          <div className="mt-8 rounded-lg border border-line bg-white/[0.035] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-signal">Market entry wedge</p>
            <p className="mt-3 text-sm leading-6 text-steel">{venture.marketEntry}</p>
          </div>
        </DeckSlide>

        <DeckSlide eyebrow="05 / Proof" title="Verified public evidence.">
          {evidence.length > 0 ? (
            <div className="grid gap-4">
              {evidence.map((item) => (
                <Link
                  key={item.label}
                  href={item.url ?? `/projects/${venture.slug}`}
                  target={item.url?.startsWith("http") ? "_blank" : undefined}
                  rel={item.url?.startsWith("http") ? "noreferrer" : undefined}
                  className="rounded-lg border border-line bg-white/[0.035] p-5 transition hover:border-signal/35"
                >
                  {item.date ? (
                    <time className="font-mono text-xs uppercase tracking-[0.18em] text-signal" dateTime={item.date}>
                      {item.date}
                    </time>
                  ) : null}
                  <h3 className="mt-2 text-lg font-semibold text-white">{item.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-steel">{item.description}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p>Public evidence is still being assembled. The deck intentionally avoids unverified proof claims.</p>
          )}
        </DeckSlide>

        <DeckSlide eyebrow="06 / Business" title="Commercial paths.">
          <BulletGrid items={venture.businessModel} />
          <div className="mt-8 rounded-lg border border-line bg-white/[0.035] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-signal">Capital or partnership objective</p>
            <p className="mt-3 text-lg font-semibold leading-7 text-white">{venture.currentAsk}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {venture.capitalObjectives.map((objective) => (
                <span key={objective} className="rounded-md bg-signal/10 px-3 py-2 font-mono text-xs text-signal">
                  {capitalObjectiveLabels[objective]}
                </span>
              ))}
            </div>
          </div>
        </DeckSlide>

        <DeckSlide eyebrow="07 / Milestones" title="What has moved and what comes next.">
          <div className="grid gap-3">
            {venture.milestones.map((milestone, index) => (
              <div key={milestone} className="rounded-lg border border-line bg-white/[0.035] p-5">
                <p className="font-mono text-xs text-volt">0{index + 1}</p>
                <p className="mt-3 text-sm leading-6 text-steel">{milestone}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-lg border border-signal/30 bg-signal/[0.06] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-signal">Next milestone</p>
            <p className="mt-3 text-lg font-semibold leading-7 text-white">{venture.nextMilestone}</p>
          </div>
        </DeckSlide>

        <DeckSlide eyebrow="08 / Risk" title="What must stay explicit.">
          <BulletGrid items={venture.risks} />
        </DeckSlide>

        <section className="border-t border-line py-16 sm:py-20">
          <div className="rounded-lg border border-signal/30 bg-signal/[0.06] p-8 sm:p-10">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">Next conversation</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">
              Qualified diligence starts with context.
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-steel">
              Request the appropriate investor, pilot, partnership, grant, or research materials through the
              segmented contact path.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button href={`/contact?intent=investor&venture=${venture.slug}&sourcePage=/projects/${venture.slug}/deck&campaign=${venture.slug}-deck-final-cta`}>
                Request materials
              </Button>
              <Button href={`/projects/${venture.slug}`} variant="secondary">
                Venture brief
              </Button>
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}
