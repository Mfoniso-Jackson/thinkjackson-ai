import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Mfoniso Jackson for AI systems, market intelligence, agent architecture, and research-to-product work."
};

export default function ContactPage() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <Reveal>
          <div className="max-w-4xl">
            <p className="font-mono text-sm uppercase tracking-[0.3em] text-signal">Contact</p>
            <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl">
              Bring a hard systems problem.
            </h1>
            <p className="mt-7 text-lg leading-8 text-steel">
              For consulting, collaboration, research conversations, or founder-to-founder
              notes, send a concise brief with the system, stakes, constraints, and what
              needs to become true.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <div className="rounded-lg border border-line bg-white/[0.035] p-6">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-signal">Email</p>
            <Link
              href="mailto:hello@thinkjackson.com"
              className="mt-4 block text-2xl font-semibold text-white hover:text-signal"
            >
              hello@thinkjackson.com
            </Link>
            <p className="mt-4 text-sm leading-6 text-steel">
              Routed for research conversations, consulting inquiries, and serious collaborations.
            </p>
          </div>
          <div className="rounded-lg border border-line bg-white/[0.035] p-6">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-signal">Brief format</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-steel">
              <li>What are you building, researching, or trying to decide?</li>
              <li>Where do AI systems, markets, agents, or coordination enter the problem?</li>
              <li>What would a successful first conversation clarify?</li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
