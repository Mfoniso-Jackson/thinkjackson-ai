import type { Metadata } from "next";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { AskForm } from "@/components/ask-form";
import { CTASection } from "@/components/cta-section";

export const metadata: Metadata = {
  title: "Ask ThinkJackson",
  description:
    "A grounded question-answering interface over ThinkJackson's real knowledge graph — every answer traces back to a published claim and its source, or says plainly when the graph doesn't have enough yet.",
  alternates: {
    canonical: "/ask"
  }
};

export default function AskPage() {
  return (
    <>
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <div className="max-w-3xl">
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-signal">Ask ThinkJackson</p>
              <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                Ask the graph, not a chatbot.
              </h1>
              <p className="mt-7 text-lg leading-8 text-steel">
                Every answer is grounded in ThinkJackson&apos;s actual published knowledge graph — concepts, claims,
                and sources that already exist, not general knowledge. If the graph doesn&apos;t have enough to
                answer honestly, it says so instead of guessing.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-y border-line bg-graphite/60 py-20">
        <Container>
          <div className="max-w-2xl">
            <AskForm />
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
