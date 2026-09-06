import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { RelatedNodes } from "@/components/related-nodes";
import { CTASection } from "@/components/cta-section";
import { getPerson, people } from "@/data/people";

type PersonPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return people.map((person) => ({ slug: person.slug }));
}

export async function generateMetadata({ params }: PersonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const person = getPerson(slug);
  if (!person) return {};

  return {
    title: person.name,
    description: person.summary,
    alternates: { canonical: `/people/${slug}` }
  };
}

export default async function PersonPage({ params }: PersonPageProps) {
  const { slug } = await params;
  const person = getPerson(slug);

  if (!person) {
    notFound();
  }

  return (
    <>
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <Link href="/people" className="font-mono text-xs uppercase tracking-[0.24em] text-signal hover:text-white">
              People
            </Link>
            <div className="mt-8 max-w-4xl">
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-signal">{person.role}</p>
              <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                {person.name}
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-steel">{person.summary}</p>
              {slug === "mfoniso-jackson" ? (
                <Link href="/about" className="mt-5 inline-flex text-sm font-semibold text-signal hover:text-white">
                  Read the full founder profile
                </Link>
              ) : null}
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-y border-line bg-graphite/60 py-20">
        <Container>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">Believes</p>
          <div className="mt-6 grid gap-3">
            {person.believes.map((belief) => (
              <div key={belief} className="rounded-lg border border-line bg-white/[0.035] p-5 text-sm leading-6 text-white">
                {belief}
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <RelatedNodes nodeRef={{ type: "person", slug: person.slug }} heading="Connected across the graph" />
        </Container>
      </section>

      <CTASection />
    </>
  );
}
