import type { Metadata } from "next";
import { Container } from "@/components/container";
import { CTASection } from "@/components/cta-section";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { WritingCard } from "@/components/writing-card";
import { writing } from "@/data/site";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Essays and field notes on AI systems, markets, reinforcement learning, safety, and coordination."
};

export default function WritingPage() {
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
                The writing library is intentionally structured for MDX migration: local
                arrays today, richer long-form essays tomorrow.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-y border-line bg-graphite/60 py-20">
        <Container>
          <SectionHeading eyebrow="Selected essays" title="Placeholder posts." />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {writing.map((post, index) => (
              <Reveal key={post.title} delay={index * 0.06}>
                <WritingCard {...post} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
      <CTASection />
    </>
  );
}
