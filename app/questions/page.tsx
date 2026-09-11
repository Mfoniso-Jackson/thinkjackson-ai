import type { Metadata } from "next";
import { Container } from "@/components/container";
import { NodeCard } from "@/components/node-card";
import { Reveal } from "@/components/reveal";
import { CTASection } from "@/components/cta-section";
import { listOpenLoops } from "@/lib/kg-store";
import type { OpenLoopStatus } from "@/lib/kg-types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Questions",
  description:
    "The open questions ThinkJackson is tracking — surfaced by research, not answered by assertion. Accumulated over time rather than published as conclusions.",
  alternates: {
    canonical: "/questions"
  }
};

const statusLabels: Record<OpenLoopStatus, string> = {
  open: "Open",
  investigating: "Investigating",
  resolved: "Resolved",
  abandoned: "Abandoned"
};

export default async function QuestionsPage() {
  const questions = await listOpenLoops();

  return (
    <>
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <div className="max-w-4xl">
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-signal">Questions</p>
              <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                What ThinkJackson doesn&apos;t yet know.
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-steel">
                ThinkJackson accumulates open questions rather than only publishing answers. Each one here was raised
                by real research passing through the discovery pipeline, connected to the specific idea or territory
                it emerged from — with a working hypothesis and status, not just a title.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-y border-line bg-graphite/60 py-20">
        <Container>
          {questions.length === 0 ? (
            <div className="rounded-lg border border-dashed border-line bg-white/[0.02] p-8 text-sm leading-6 text-steel">
              No open questions yet. They emerge from approved research, not from a starting list — check back once
              the discovery pipeline has run.
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {questions.map((question, index) => (
                <Reveal key={question.slug} delay={index * 0.04}>
                  <NodeCard
                    href={`/questions/${question.slug}`}
                    eyebrow={statusLabels[question.metadata.status]}
                    title={question.title}
                    summary={question.metadata.hypothesis ?? "No working hypothesis yet — see what it connects to."}
                  />
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </section>
      <CTASection />
    </>
  );
}
