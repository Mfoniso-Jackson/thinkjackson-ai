import type { Metadata } from "next";
import Link from "next/link";
import { AnalyticsMarker } from "@/components/analytics-marker";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { InvestorLeadForm } from "@/components/investor-lead-form";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { capitalObjectiveLabels, flagshipVenture, investorOverview, publicVentures } from "@/data/ventures";
import { verifiedEvidence } from "@/lib/venture-validation";

export const metadata: Metadata = {
  title: "Investor Brief",
  description:
    "Investor-facing overview of Mfoniso Jackson's AI-native venture portfolio across financial intelligence, quant infrastructure, recognition, property intelligence, and agent safety.",
  alternates: {
    canonical: "/investors"
  },
  openGraph: {
    title: "Investor Brief | thinkjackson",
    description:
      "A venture and research platform for adaptive intelligence infrastructure across markets, risk, trust, and coordination.",
    url: "https://thinkjackson.com/investors"
  }
};

export default function InvestorsPage() {
  return (
    <>
      <AnalyticsMarker event="investor_brief_viewed" />
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <div className="max-w-5xl">
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-signal">Investor Brief</p>
              <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                Adaptive intelligence infrastructure for markets, risk, trust, and economic coordination.
              </h1>
              <p className="mt-7 max-w-4xl text-lg leading-8 text-steel">
                thinkjackson is the public front door to Mfoniso Jackson&apos;s venture and research platform.
                The portfolio spans financial intelligence, autonomous agents, quant infrastructure,
                property operations, worker recognition, incident intelligence, and AI safety research.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button href="#request">Request investor materials</Button>
                <Button href={`/projects/${flagshipVenture.slug}`} variant="secondary">
                  View flagship venture
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-y border-line bg-graphite/60 py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <SectionHeading eyebrow="Investment overview" title="One thesis, multiple venture surfaces.">
              <p>{investorOverview.thesis}</p>
            </SectionHeading>
            <div className="grid gap-4 md:grid-cols-2">
              {investorOverview.whyNow.map((item) => (
                <div key={item} className="rounded-lg border border-line bg-white/[0.035] p-5 text-sm leading-6 text-steel">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionHeading eyebrow="Flagship opportunity" title={flagshipVenture.name}>
            <p>{flagshipVenture.investmentThesis}</p>
          </SectionHeading>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {[
              ["Problem", flagshipVenture.problem],
              ["Solution", flagshipVenture.solution],
              ["Current objective", flagshipVenture.currentAsk]
            ].map(([label, copy]) => (
              <div key={label} className="rounded-lg border border-line bg-white/[0.035] p-6">
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-signal">{label}</p>
                <p className="mt-4 text-sm leading-7 text-steel">{copy}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href={`/projects/${flagshipVenture.slug}`}>Read full venture brief</Button>
            <Button href="#request" variant="secondary">
              Request investor materials
            </Button>
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-graphite/60 py-20">
        <Container>
          <SectionHeading eyebrow="Venture comparison" title="A disciplined portfolio view." />
          <div className="mt-10 overflow-hidden rounded-lg border border-line">
            <div className="hidden grid-cols-[1fr_1fr_1.2fr_0.8fr_1fr_0.7fr] gap-px bg-line text-sm lg:grid">
              {["Venture", "Market", "Customer", "Stage", "Objective", "Detail"].map((heading) => (
                <div key={heading} className="bg-panel p-4 font-mono text-xs uppercase tracking-[0.2em] text-signal">
                  {heading}
                </div>
              ))}
              {publicVentures.map((venture) => (
                <div key={venture.slug} className="contents">
                  <div className="bg-ink p-4 font-semibold text-white">{venture.name}</div>
                  <div className="bg-ink p-4 text-steel">{venture.category}</div>
                  <div className="bg-ink p-4 text-steel">{venture.targetCustomer}</div>
                  <div className="bg-ink p-4 text-steel">{venture.statusLabel}</div>
                  <div className="bg-ink p-4 text-steel">
                    {venture.capitalObjectives.map((objective) => capitalObjectiveLabels[objective]).join(" / ")}
                  </div>
                  <div className="bg-ink p-4">
                    <Link href={`/projects/${venture.slug}`} className="font-semibold text-signal hover:text-white">
                      Brief
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid gap-px bg-line lg:hidden">
              {publicVentures.map((venture) => (
                <div key={venture.slug} className="bg-ink p-5">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">{venture.category}</p>
                  <h3 className="mt-3 text-xl font-semibold text-white">{venture.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-steel">{venture.targetCustomer}</p>
                  <p className="mt-3 text-sm text-white">{venture.statusLabel}</p>
                  <Link href={`/projects/${venture.slug}`} className="mt-4 inline-flex font-semibold text-signal hover:text-white">
                    Read brief
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <SectionHeading eyebrow="Capital logic" title="Milestone-driven and venture-specific.">
              <p>{investorOverview.capitalLogic}</p>
            </SectionHeading>
            <div className="grid gap-3">
              {investorOverview.useOfFunds.map((item) => (
                <div key={item} className="rounded-lg border border-line bg-white/[0.035] p-4 text-sm text-steel">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {publicVentures.filter((venture) => venture.capitalObjectives[0] !== "not-raising").map((venture) => (
              <div key={venture.slug} className="rounded-lg border border-line bg-white/[0.035] p-5">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">{venture.name}</p>
                <h3 className="mt-3 text-xl font-semibold text-white">{venture.nextMilestone}</h3>
                <p className="mt-3 text-sm leading-6 text-steel">{venture.currentAsk}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-graphite/60 py-20">
        <Container>
          <SectionHeading eyebrow="Verified public evidence" title="Proof-of-work without inflated metrics.">
            <p>Only public, verified evidence is rendered here. Private materials are shared only after qualified conversations.</p>
          </SectionHeading>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {publicVentures.flatMap((venture) =>
              verifiedEvidence(venture).map((item) => (
                <Link
                  key={`${venture.slug}-${item.label}`}
                  href={item.url ?? `/projects/${venture.slug}`}
                  target={item.url?.startsWith("http") ? "_blank" : undefined}
                  rel={item.url?.startsWith("http") ? "noreferrer" : undefined}
                  className="rounded-lg border border-line bg-white/[0.035] p-5 transition hover:border-signal/35"
                >
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">{venture.name}</p>
                  <h3 className="mt-3 text-lg font-semibold text-white">{item.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-steel">{item.description}</p>
                </Link>
              ))
            )}
          </div>
        </Container>
      </section>

      <section id="request" className="py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHeading eyebrow="Due diligence request" title="Request the appropriate investor materials.">
              <p>
                Confidential decks, models, private repositories, cap tables, customer data, and sensitive technical
                documents are not published on this site. Qualified requests are routed into a founder review path.
              </p>
            </SectionHeading>
            <InvestorLeadForm />
          </div>
        </Container>
      </section>
    </>
  );
}
