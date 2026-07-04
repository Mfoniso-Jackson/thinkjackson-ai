import type { Metadata } from "next";
import { Container } from "@/components/container";
import { CTASection } from "@/components/cta-section";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Mfoniso Jackson, an AI engineer building systems for markets, agents, and human coordination."
};

export default function AboutPage() {
  return (
    <>
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <div className="max-w-4xl">
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-signal">About</p>
              <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                Builder, researcher, and founder working where intelligence meets markets.
              </h1>
              <p className="mt-7 text-lg leading-8 text-steel">
                Mfoniso Jackson builds AI systems that reason about capital, incentives,
                behavior, and coordination. His work connects reinforcement learning,
                financial engineering, autonomous agents, Web3 coordination, and the safety
                questions that emerge when machines learn rituals from noisy worlds.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-y border-line bg-graphite/60 py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHeading eyebrow="Operating thesis" title="Intelligence needs structure.">
              <p>
                The site is organized around a simple belief: powerful systems become useful
                when they are constrained by good representations, explicit incentives, and
                honest feedback from reality.
              </p>
            </SectionHeading>
            <div className="space-y-5 text-base leading-8 text-steel">
              <p>
                In markets, that means agents must understand risk, regime change, liquidity,
                and the temptation to confuse backtest artifacts with durable signal.
              </p>
              <p>
                In safety, it means studying the strange persistence of learned proxies and
                non-causal behaviors before they become invisible architecture.
              </p>
              <p>
                In product, it means turning research into tools that founders, operators,
                investors, and communities can actually use under pressure.
              </p>
            </div>
          </div>
        </Container>
      </section>
      <CTASection />
    </>
  );
}
