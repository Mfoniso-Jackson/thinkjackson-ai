import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import {
  artifactsByCategory,
  evidenceArtifacts,
  evidenceCategoryLabels,
  evidenceMetrics,
  type EvidenceCategory
} from "@/data/evidence";

const categories: EvidenceCategory[] = ["production", "research", "market", "financial", "growth"];

export const metadata: Metadata = {
  title: "Evidence Dashboard",
  description:
    "A source-backed dashboard of public proof-of-work, repositories, writing, and founder input gaps for thinkjackson.",
  alternates: {
    canonical: "/evidence"
  }
};

export default function EvidencePage() {
  return (
    <>
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <div className="max-w-4xl">
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-signal">
                Evidence Dashboard
              </p>
              <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                Public proof, separated from ambition.
              </h1>
              <p className="mt-7 text-lg leading-8 text-steel">
                This page is the diligence layer for thinkjackson: repositories, essays, system briefs, and
                explicit source-data gaps. Metrics stay blank until they can be backed by a public artifact,
                analytics export, customer log, or founder-approved record.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-y border-line bg-graphite/60 py-20">
        <Container>
          <SectionHeading eyebrow="Metrics" title="Measured claims only." />
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {evidenceMetrics.map((metric) => (
              <div key={metric.label} className="rounded-lg border border-line bg-white/[0.035] p-5">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
                    {evidenceCategoryLabels[metric.category]}
                  </p>
                  <span className="rounded-md border border-line px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-steel">
                    {metric.status === "verified" ? "Verified" : "Needs source"}
                  </span>
                </div>
                <p className="mt-5 text-4xl font-semibold tracking-tight text-white">{metric.value}</p>
                <h2 className="mt-4 text-lg font-semibold text-white">{metric.label}</h2>
                <p className="mt-2 text-sm leading-6 text-steel">{metric.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionHeading eyebrow="Artifacts" title={`${evidenceArtifacts.length} inspectable public artifacts.`}>
            <p>
              The dashboard favors links a reader can open: repositories, essays, and public project pages.
              Future Supabase-backed evidence can add customers, grants, users, revenue, and partnership records.
            </p>
          </SectionHeading>
          <div className="mt-10 grid gap-10">
            {categories.map((category) => {
              const artifacts = artifactsByCategory(category);

              return (
                <div key={category}>
                  <h2 className="font-mono text-sm uppercase tracking-[0.24em] text-signal">
                    {evidenceCategoryLabels[category]}
                  </h2>
                  {artifacts.length > 0 ? (
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      {artifacts.map((artifact) => (
                        <Link
                          key={artifact.id}
                          href={artifact.url ?? "/evidence"}
                          target={artifact.url?.startsWith("http") ? "_blank" : undefined}
                          rel={artifact.url?.startsWith("http") ? "noreferrer" : undefined}
                          className="rounded-lg border border-line bg-white/[0.035] p-5 transition hover:border-signal/35"
                        >
                          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-steel">
                            <time dateTime={artifact.date}>{artifact.date}</time>
                            <span aria-hidden="true">/</span>
                            <span>{artifact.type}</span>
                          </div>
                          <h3 className="mt-4 text-xl font-semibold text-white">{artifact.title}</h3>
                          {artifact.ventureName ? (
                            <p className="mt-2 font-mono text-xs uppercase tracking-[0.18em] text-signal">
                              {artifact.ventureName}
                            </p>
                          ) : null}
                          <p className="mt-3 text-sm leading-6 text-steel">{artifact.description}</p>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-5 rounded-lg border border-line bg-ink/70 p-5">
                      <p className="text-sm leading-6 text-steel">
                        No verified public artifacts in this category yet. Add source-backed records before
                        publishing claims here.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
