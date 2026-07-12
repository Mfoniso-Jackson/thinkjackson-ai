import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { SalesLeadForm } from "@/components/sales-lead-form";
import { SocialIcon } from "@/components/social-icons";
import { socialLinks } from "@/data/site";
import type { LeadIntent } from "@/lib/sales-types";
import { leadIntents } from "@/lib/sales-validation";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Mfoniso Jackson for AI systems, market intelligence, agent architecture, and research-to-product work."
};

type ContactPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = (await searchParams) ?? {};
  const requestedIntent = firstParam(params.intent);
  const defaultIntent = leadIntents.includes(requestedIntent as LeadIntent) ? (requestedIntent as LeadIntent) : "general";
  const venture = firstParam(params.venture);
  const campaign = firstParam(params.campaign);
  const sourcePage = firstParam(params.sourcePage) ?? "/contact";

  return (
    <>
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <div className="max-w-4xl">
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-signal">Contact</p>
              <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                Route the conversation with enough context to act.
              </h1>
              <p className="mt-7 text-lg leading-8 text-steel">
                Investor, pilot, grant, partnership, research, consulting, media, and general enquiries use different
                qualification paths. This form preserves source page, venture, campaign, referrer, and UTM context.
              </p>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <SalesLeadForm
              defaultIntent={defaultIntent}
              defaultVenture={venture}
              sourcePage={sourcePage}
              campaign={campaign}
              utmSource={firstParam(params.utm_source)}
              utmMedium={firstParam(params.utm_medium)}
              utmCampaign={firstParam(params.utm_campaign)}
            />

            <div className="grid gap-5">
              <div className="rounded-lg border border-line bg-white/[0.035] p-6">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-signal">Direct email</p>
                <Link
                  href="mailto:hello@thinkjackson.com"
                  className="mt-4 block text-2xl font-semibold text-white hover:text-signal"
                >
                  hello@thinkjackson.com
                </Link>
                <p className="mt-4 text-sm leading-6 text-steel">
                  Use email if the secure lead webhook has not been configured yet or the request includes sensitive context.
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
                        className="inline-flex items-center gap-3 text-xl font-semibold text-white hover:text-signal"
                      >
                        <span className="grid h-10 w-10 place-items-center rounded-lg border border-signal/35 bg-signal/10 text-signal">
                          <SocialIcon kind={item.kind} className="h-5 w-5" />
                        </span>
                        <span>{"handle" in item ? item.handle : item.label}</span>
                      </Link>
                    ) : (
                      <div
                        key={item.label}
                        className="inline-flex items-center gap-3 text-xl font-semibold text-white"
                      >
                        <span className="grid h-10 w-10 place-items-center rounded-lg border border-signal/35 bg-signal/10 text-signal">
                          <SocialIcon kind={item.kind} className="h-5 w-5" />
                        </span>
                        <span>{item.handle}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
              <div className="rounded-lg border border-line bg-white/[0.035] p-6">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-signal">Brief format</p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-steel">
                  <li>Intent: investor, pilot, customer, grant, partner, research, consulting, media, or general.</li>
                  <li>System, market, or decision you are trying to improve.</li>
                  <li>Current workflow, constraints, timing, and stakes.</li>
                  <li>What a useful first conversation should unlock.</li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
