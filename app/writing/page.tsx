import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/card";
import { Container } from "@/components/container";
import { CTASection } from "@/components/cta-section";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { WritingCard } from "@/components/writing-card";
import { writing, writingQueue, writingTracks } from "@/data/site";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Essays and field notes on AI systems, markets, reinforcement learning, safety, and coordination."
};

export default function WritingPage() {
  const [featuredPost, ...archivePosts] = writing;

  return (
    <>
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <div className="max-w-4xl">
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-signal">Writing</p>
              <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                Notes on agents, markets, coordination, and the strange behavior of adaptive systems.
              </h1>
              <p className="mt-7 text-lg leading-8 text-steel">
                Essays and field notes for making the research agenda legible: where
                agents learn rituals, portfolios become memory systems, and coordination
                becomes infrastructure.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-y border-line bg-graphite/60 py-20">
        <Container>
          <SectionHeading eyebrow="Editorial system" title="A public notebook for systems that learn, trade, and coordinate.">
            <p>
              The writing is organized around a small number of durable questions:
              what agents preserve, how markets remember, and which coordination
              primitives make autonomous systems safer to use.
            </p>
          </SectionHeading>

          <div className="mt-10 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
            <Reveal>
              <Card className="flex h-full flex-col p-7 sm:p-8">
                <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-steel">
                  <span className="text-signal">Start here</span>
                  <span aria-hidden="true">/</span>
                  <time dateTime={featuredPost.date}>{formatDate(featuredPost.date)}</time>
                  <span aria-hidden="true">/</span>
                  <span>{featuredPost.readingTime}</span>
                </div>
                <h2 className="mt-5 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  <Link href={`/writing/${featuredPost.slug}`} className="hover:text-signal">
                    {featuredPost.title}
                  </Link>
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-8 text-steel">{featuredPost.excerpt}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {featuredPost.tags.map((tag) => (
                    <span key={tag} className="rounded-md bg-white/5 px-2.5 py-1 font-mono text-xs text-signal">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-auto pt-10">
                  <Link
                    href={`/writing/${featuredPost.slug}`}
                    className="inline-flex rounded-md border border-signal/40 px-4 py-2 text-sm font-semibold text-signal transition hover:border-signal hover:bg-signal/10 hover:text-white"
                  >
                    Read the essay
                  </Link>
                </div>
              </Card>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="rounded-lg border border-line bg-void/70 p-6">
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">Writing tracks</p>
                <div className="mt-6 space-y-6">
                  {writingTracks.map((track) => (
                    <div key={track.title} className="border-t border-line pt-5 first:border-t-0 first:pt-0">
                      <h3 className="text-base font-semibold text-white">{track.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-steel">{track.summary}</p>
                      <p className="mt-3 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-steel/80">
                        {track.cadence}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionHeading eyebrow="Selected essays" title="Published field notes." />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {archivePosts.map((post, index) => (
              <Reveal key={post.title} delay={index * 0.06}>
                <WritingCard {...post} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-graphite/60 py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <Reveal>
              <SectionHeading eyebrow="Editorial queue" title="The next ideas to make concrete.">
                <p>
                  These are not filler posts. They are the next pieces needed to
                  connect the research agenda, project architecture, and founder
                  thesis into a more complete body of work.
                </p>
              </SectionHeading>
            </Reveal>
            <div className="grid gap-4">
              {writingQueue.map((item, index) => (
                <Reveal key={item.title} delay={index * 0.05}>
                  <div className="rounded-lg border border-line bg-white/[0.035] p-5">
                    <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-steel">
                      <span className="text-signal">{item.theme}</span>
                      <span aria-hidden="true">/</span>
                      <span>Draft queue</span>
                    </div>
                    <h3 className="mt-3 text-lg font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-steel">{item.note}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>
      <CTASection />
    </>
  );
}
