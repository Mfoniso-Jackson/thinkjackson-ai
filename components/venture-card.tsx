import Link from "next/link";
import type { Venture } from "@/lib/venture-types";
import { capitalObjectiveLabels } from "@/data/ventures";

export function VentureCard({ venture }: { venture: Venture }) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-line bg-white/[0.035] p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-md border border-line px-2 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-steel">
          {venture.statusLabel}
        </span>
        {venture.flagship ? (
          <span className="rounded-md bg-signal/10 px-2 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-signal">
            Flagship
          </span>
        ) : null}
      </div>
      <p className="mt-5 font-mono text-xs uppercase tracking-[0.22em] text-signal">{venture.category}</p>
      <h3 className="mt-3 text-2xl font-semibold text-white">{venture.name}</h3>
      <p className="mt-3 text-sm leading-6 text-steel">{venture.problem}</p>
      <p className="mt-4 flex-1 text-sm leading-6 text-white">{venture.solution}</p>
      <div className="mt-5 border-t border-line pt-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-steel">Current objective</p>
        <p className="mt-2 text-sm leading-6 text-steel">
          {venture.capitalObjectives.map((objective) => capitalObjectiveLabels[objective]).join(" / ")}
        </p>
      </div>
      <Link href={`/projects/${venture.slug}`} className="mt-6 text-sm font-semibold text-signal hover:text-white">
        View venture brief
      </Link>
    </article>
  );
}
