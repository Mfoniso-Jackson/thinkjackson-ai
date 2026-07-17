import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { evidenceCategoryLabels, timelineEvents } from "@/data/evidence";

export const metadata: Metadata = {
  title: "Execution Timeline",
  description:
    "A chronological execution timeline for thinkjackson research, products, repositories, and platform releases.",
  alternates: {
    canonical: "/timeline"
  }
};

export default function TimelinePage() {
  return (
    <>
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <div className="max-w-4xl">
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-signal">
                Execution Timeline
              </p>
              <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                A public operating history for the work.
              </h1>
              <p className="mt-7 text-lg leading-8 text-steel">
                The timeline records visible releases and research milestones. It is intentionally conservative:
                internal work should become public here only when there is a page, repo, post, demo, or source record.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-y border-line bg-graphite/60 py-20">
        <Container>
          <SectionHeading eyebrow="Milestones" title="Chronological proof-of-work." />
          <div className="mt-10 grid gap-5">
            {timelineEvents.map((event) => (
              <Link
                key={`${event.date}-${event.title}`}
                href={event.href ?? "/timeline"}
                target={event.href?.startsWith("http") ? "_blank" : undefined}
                rel={event.href?.startsWith("http") ? "noreferrer" : undefined}
                className="grid gap-5 rounded-lg border border-line bg-white/[0.035] p-5 transition hover:border-signal/35 md:grid-cols-[180px_1fr]"
              >
                <div>
                  <time className="font-mono text-sm text-signal" dateTime={event.date}>
                    {event.date}
                  </time>
                  <p className="mt-2 font-mono text-xs uppercase tracking-[0.18em] text-steel">
                    {evidenceCategoryLabels[event.category]}
                  </p>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">{event.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-steel">{event.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
