import type { Metadata } from "next";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { NewsletterForm } from "@/components/newsletter-form";
import { episodes, podcast } from "@/data/podcast";

export const metadata: Metadata = {
  title: podcast.name,
  description: podcast.tagline,
  alternates: {
    canonical: "/podcast"
  }
};

export default function PodcastPage() {
  return (
    <>
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <div className="max-w-4xl">
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-signal">Podcast</p>
              <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                {podcast.name}
              </h1>
              <p className="mt-5 text-2xl font-semibold text-signal">{podcast.tagline}</p>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-steel">{podcast.thesis}</p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-y border-line bg-graphite/60 py-20">
        <Container>
          <SectionHeading eyebrow="Episodes" title="No episodes yet." >
            <p>
              The show has not recorded its first conversation. This page will list real episodes as soon as they
              exist — nothing is staged or scheduled ahead of that.
            </p>
          </SectionHeading>
          {episodes.length === 0 ? (
            <div className="mt-10 rounded-lg border border-dashed border-line bg-white/[0.02] p-8 text-sm leading-6 text-steel">
              Be the first to know when episode one publishes.
              <div className="mt-5 max-w-md">
                <NewsletterForm sourcePage="/podcast" />
              </div>
            </div>
          ) : null}
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">Questions this show exists to ask</p>
              <div className="mt-6 grid gap-3">
                {podcast.themes.map((theme) => (
                  <div key={theme} className="rounded-lg border border-line bg-white/[0.035] p-4 text-sm leading-6 text-white">
                    {theme}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">Guest domains</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {podcast.guestDomains.map((domain) => (
                  <span key={domain} className="rounded-md border border-line bg-white/5 px-3 py-2 text-sm text-steel">
                    {domain}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
