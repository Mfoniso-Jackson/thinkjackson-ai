import Link from "next/link";
import type { Idea } from "@/data/ideas";

const statusLabels: Record<Idea["status"], string> = {
  fact: "Fact",
  interpretation: "Interpretation",
  hypothesis: "Hypothesis",
  prediction: "Prediction",
  speculation: "Speculation"
};

export function IdeaCard({ idea }: { idea: Idea }) {
  return (
    <Link
      href={`/ideas/${idea.slug}`}
      className="flex h-full flex-col rounded-lg border border-line bg-white/[0.035] p-6 transition hover:border-signal/35 active:border-signal/50"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-md border border-line px-2 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-steel">
          {statusLabels[idea.status]}
        </span>
      </div>
      <p className="mt-5 font-mono text-xs uppercase tracking-[0.22em] text-signal">{idea.eyebrow}</p>
      <h3 className="mt-3 text-xl font-semibold text-white">{idea.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-steel">{idea.summary}</p>
      <p className="mt-5 border-t border-line pt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-steel">
        {idea.signal}
      </p>
    </Link>
  );
}
