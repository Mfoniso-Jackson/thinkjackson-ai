import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { socialLinks } from "@/data/site";
import { founderProfile, publicVentures } from "@/data/ventures";

export const metadata: Metadata = {
  title: "Founder",
  description:
    "Founder profile for Mfoniso Jackson, an AI engineer and venture builder working across adaptive intelligence infrastructure, markets, agents, and coordination.",
  alternates: {
    canonical: "/about"
  }
};

export default function AboutPage() {
  return (
    <>
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <div className="max-w-5xl">
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-signal">Founder</p>
              <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                {founderProfile.headline}
              </h1>
              <p className="mt-7 max-w-4xl text-lg leading-8 text-steel">{founderProfile.bio}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/investors">Read investor brief</Button>
                <Button href="/contact" variant="secondary">
                  Start a conversation
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-y border-line bg-graphite/60 py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <SectionHeading eyebrow="Founder thesis" title="Research, systems, markets, and execution in one loop.">
              <p>{founderProfile.thesis}</p>
            </SectionHeading>
            <div className="grid gap-3 sm:grid-cols-2">
              {founderProfile.domains.map((domain) => (
                <div key={domain} className="rounded-lg border border-line bg-white/[0.035] p-4 text-sm font-medium text-white">
                  {domain}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">Selected execution history</p>
              <div className="mt-6 space-y-3">
                {founderProfile.verifiedFacts.map((fact) => (
                  <div key={fact} className="rounded-lg border border-line bg-white/[0.035] p-5 text-sm leading-6 text-steel">
                    {fact}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">Selected ventures</p>
              <div className="mt-6 space-y-3">
                {publicVentures.filter((venture) => venture.featured).map((venture) => (
                  <Link
                    key={venture.slug}
                    href={`/projects/${venture.slug}`}
                    className="block rounded-lg border border-line bg-white/[0.035] p-5 transition hover:border-signal/35"
                  >
                    <h3 className="text-lg font-semibold text-white">{venture.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-steel">{venture.tagline}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-graphite/60 py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHeading eyebrow="Public profiles" title="Where to follow the work.">
              <p>Public channels for research notes, venture updates, and founder-to-founder conversations.</p>
            </SectionHeading>
            <div className="grid gap-3 sm:grid-cols-2">
              {socialLinks.map((item) =>
                "href" in item ? (
                  <Link
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-line bg-white/[0.035] p-5 text-sm font-semibold text-signal hover:text-white"
                  >
                    {"handle" in item ? item.handle : item.label}
                  </Link>
                ) : (
                  <div key={item.label} className="rounded-lg border border-line bg-white/[0.035] p-5 text-sm font-semibold text-white">
                    {item.label}: {item.handle}
                  </div>
                )
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
