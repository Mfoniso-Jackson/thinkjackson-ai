"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { relationTypeLabels } from "@/lib/graph/types";

export function RelatedNodeLink({ item }: { item: { direction: string; relationType: string; resolved: { href: string; title: string; summary: string } } }) {
  return (
    <Link
      href={item.resolved.href}
      onClick={() => trackEvent("relationship_clicked", { relationType: item.relationType, direction: item.direction })}
      className="block rounded-lg border border-line bg-white/[0.035] p-5 transition hover:border-signal/35 active:border-signal/50"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-steel">
        {relationTypeLabels[item.relationType as keyof typeof relationTypeLabels] ?? item.relationType}
      </p>
      <h3 className="mt-2 text-base font-semibold text-white">{item.resolved.title}</h3>
      <p className="mt-2 text-sm leading-6 text-steel">{item.resolved.summary}</p>
    </Link>
  );
}
