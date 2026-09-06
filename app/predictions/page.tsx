import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { CTASection } from "@/components/cta-section";
import { listPublishedNodesByType } from "@/lib/kg-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Predictions",
  description:
    "ThinkJackson's public prediction ledger — claims about future outcomes, surfaced by research, dated, and left open for a later verdict rather than quietly forgotten.",
  alternates: {
    canonical: "/predictions"
  }
};

export default async function PredictionsPage() {
  const predictions = await listPublishedNodesByType("prediction");

  return (
    <>
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <div className="max-w-4xl">
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-signal">Predictions</p>
              <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                A public record, not a highlight reel.
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-steel">
                Every prediction here was raised by real research and approved by a human before publishing — the
                brief behind this site is explicit that predictions stay a human call, not an agent one. Each stays
                dated and unresolved until there&apos;s a real verdict to record, not a probability invented to look
                rigorous.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-y border-line bg-graphite/60 py-20">
        <Container>
          {predictions.length === 0 ? (
            <div className="rounded-lg border border-dashed border-line bg-white/[0.02] p-8 text-sm leading-6 text-steel">
              No predictions published yet. They come from approved research, not a starting list — check back once
              the discovery pipeline has run.
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {predictions.map((prediction, index) => {
                const rationale = typeof prediction.metadata.rationale === "string" ? prediction.metadata.rationale : undefined;
                const status = typeof prediction.metadata.resolutionStatus === "string" ? prediction.metadata.resolutionStatus : "unresolved";
                return (
                  <Reveal key={prediction.slug} delay={index * 0.04}>
                    <Link
                      href={`/predictions/${prediction.slug}`}
                      className="flex h-full flex-col rounded-lg border border-line bg-white/[0.035] p-6 transition hover:border-signal/35 active:border-signal/50"
                    >
                      <span className="inline-flex w-fit rounded-md border border-line px-2 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-steel">
                        {status}
                      </span>
                      <h3 className="mt-4 text-lg font-semibold text-white">{prediction.title}</h3>
                      {rationale ? <p className="mt-3 flex-1 text-sm leading-6 text-steel">{rationale}</p> : null}
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          )}
        </Container>
      </section>
      <CTASection />
    </>
  );
}
