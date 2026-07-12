import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { SocialIcon } from "@/components/social-icons";
import { socialLinks } from "@/data/site";

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
              For investor, grant, pilot, strategic, research, media, or general enquiries,
              send a concise brief with the system, stakes, constraints, and what needs to become true.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
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
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-signal">Social</p>
            <div className="mt-4 flex flex-col gap-3">
              {socialLinks.map((item) =>
                "href" in item ? (
                  <Link
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 text-2xl font-semibold text-white hover:text-signal"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-lg border border-signal/35 bg-signal/10 text-signal">
                      <SocialIcon kind={item.kind} className="h-5 w-5" />
                    </span>
                    <span>{"handle" in item ? item.handle : item.label}</span>
                  </Link>
                ) : (
                  <div
                    key={item.label}
                    className="inline-flex items-center gap-3 text-2xl font-semibold text-white"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-lg border border-signal/35 bg-signal/10 text-signal">
                      <SocialIcon kind={item.kind} className="h-5 w-5" />
                    </span>
                    <span>{item.handle}</span>
                  </div>
                )
              )}
            </div>
            <p className="mt-4 text-sm leading-6 text-steel">
              Connect for research notes, project updates, and founder-to-founder conversations.
            </p>
          </div>
          <div className="rounded-lg border border-line bg-white/[0.035] p-6">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-signal">Brief format</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-steel">
              <li>Intent: investor, grant provider, pilot customer, strategic partner, research collaborator, media, or general.</li>
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
