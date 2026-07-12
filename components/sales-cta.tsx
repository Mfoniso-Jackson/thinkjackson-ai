import Link from "next/link";
import { defaultPublicCtas, leadIntentLabels, ventureCtas } from "@/data/sales-config";
import type { LeadIntent } from "@/lib/sales-types";

type SalesCta = {
  label: string;
  intent: LeadIntent;
  campaign: string;
};

function contactHref({ intent, venture, sourcePage, campaign }: { intent: LeadIntent; venture?: string; sourcePage: string; campaign: string }) {
  const params = new URLSearchParams({
    intent,
    sourcePage,
    campaign
  });

  if (venture) {
    params.set("venture", venture);
  }

  return `/contact?${params.toString()}`;
}

export function SalesCtaGroup({
  title = "Start the right conversation.",
  description = "Choose the path that matches your intent so the first reply can be useful, specific, and properly routed.",
  sourcePage,
  ventureSlug,
  ctas
}: {
  title?: string;
  description?: string;
  sourcePage: string;
  ventureSlug?: string;
  ctas?: readonly SalesCta[];
}) {
  const items = ctas ?? (ventureSlug ? ventureCtas[ventureSlug] : undefined) ?? defaultPublicCtas;

  return (
    <div className="rounded-lg border border-line bg-white/[0.035] p-6">
      <p className="font-mono text-xs uppercase tracking-[0.24em] text-signal">Conversation path</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-steel">{description}</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {items.map((cta, index) => (
          <Link
            key={cta.campaign}
            href={contactHref({
              intent: cta.intent,
              venture: ventureSlug,
              sourcePage,
              campaign: cta.campaign
            })}
            className={
              index === 0
                ? "inline-flex min-h-11 items-center justify-center rounded-md bg-signal px-4 py-2 text-sm font-semibold text-ink transition hover:bg-white"
                : "inline-flex min-h-11 items-center justify-center rounded-md border border-line px-4 py-2 text-sm font-semibold text-white transition hover:border-signal/50"
            }
          >
            {cta.label}
          </Link>
        ))}
      </div>
      <p className="mt-4 text-xs leading-5 text-steel/80">
        Routed as {items.map((item) => leadIntentLabels[item.intent]).join(", ")}.
      </p>
    </div>
  );
}
