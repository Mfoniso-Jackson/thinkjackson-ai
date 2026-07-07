import type { Metadata } from "next";
import { Container } from "@/components/container";
import { CTASection } from "@/components/cta-section";
import { Reveal } from "@/components/reveal";
import { nowItems, ownerTasks } from "@/data/site";

export const metadata: Metadata = {
  title: "Now",
  description:
    "Current work across OmniQuantAI, computational superstition research, agentic markets, and selective consulting."
};

export default function NowPage() {
  return (
    <>
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <div className="max-w-4xl">
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-signal">Now</p>
              <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                Current work, active questions, and where the platform is moving.
              </h1>
              <p className="mt-7 text-lg leading-8 text-steel">
                A living snapshot of what Mfoniso is building and researching right now:
                financial intelligence networks, agent behavior, programmable settlement,
                and serious AI systems for economic coordination.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-y border-line bg-graphite/60 py-20">
        <Container>
          <div className="grid gap-5 md:grid-cols-2">
            {nowItems.map((item, index) => (
              <article key={item.title} className="rounded-lg border border-line bg-white/[0.035] p-6">
                <p className="font-mono text-xs text-volt">0{index + 1}</p>
                <h2 className="mt-4 text-2xl font-semibold leading-8 text-white">{item.title}</h2>
                <p className="mt-4 text-sm leading-6 text-steel">{item.detail}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">
                Owner checklist
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-white">
                Things that need your account access, judgment, or source material.
              </h2>
            </div>
            <div className="grid gap-3">
              {ownerTasks.map((task) => (
                <div key={task} className="rounded-lg border border-line bg-white/[0.035] p-5 text-sm leading-6 text-steel">
                  {task}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
      <CTASection />
    </>
  );
}
