import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { CTASection } from "@/components/cta-section";
import { Reveal } from "@/components/reveal";
import { flagshipResearch } from "@/data/site";

export const metadata: Metadata = {
  title: flagshipResearch.title,
  description: flagshipResearch.summary,
  alternates: {
    canonical: "/research/computational-superstition"
  }
};

export default function ComputationalSuperstitionPage() {
  return (
    <>
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <Link href="/research" className="font-mono text-xs uppercase tracking-[0.24em] text-signal hover:text-white">
              Research
            </Link>
            <div className="mt-8 max-w-5xl">
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-volt">Flagship research</p>
              <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                {flagshipResearch.title}
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-steel">{flagshipResearch.summary}</p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-y border-line bg-graphite/60 py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">Research questions</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">What the work is trying to isolate.</h2>
            </div>
            <div className="grid gap-3">
              {flagshipResearch.questions.map((question) => (
                <div key={question} className="rounded-lg border border-line bg-white/[0.035] p-5 text-sm leading-6 text-steel">
                  {question}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="max-w-3xl space-y-12">
            {flagshipResearch.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-2xl font-semibold text-white">{section.heading}</h2>
                <div className="mt-5 space-y-5 text-base leading-8 text-steel">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </Container>
      </section>
      <CTASection />
    </>
  );
}
