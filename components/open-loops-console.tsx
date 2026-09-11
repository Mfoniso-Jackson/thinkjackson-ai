"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { saveOpenLoop } from "@/app/admin/questions/actions";
import { openLoopStatuses, type OpenLoopStatus } from "@/lib/kg-types";
import type { PublishedNode } from "@/lib/kg-store";
import type { OpenLoopMetadata } from "@/lib/kg-types";

type Loop = PublishedNode & { metadata: OpenLoopMetadata };

const statusLabels: Record<OpenLoopStatus, string> = {
  open: "Open",
  investigating: "Investigating",
  resolved: "Resolved",
  abandoned: "Abandoned"
};

function LoopEditor({ loop }: { loop: Loop }) {
  const [status, setStatus] = useState<OpenLoopStatus>(loop.metadata.status);
  const [hypothesis, setHypothesis] = useState(loop.metadata.hypothesis ?? "");
  const [evidenceSummary, setEvidenceSummary] = useState(loop.metadata.evidenceSummary ?? "");
  const [nextAction, setNextAction] = useState(loop.metadata.nextAction ?? "");
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState<"idle" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  function handleSave() {
    setSaved("idle");
    setError(null);
    startTransition(async () => {
      const result = await saveOpenLoop(loop.slug, { status, hypothesis, evidenceSummary, nextAction });
      if (!result.ok) {
        setSaved("error");
        setError(result.error);
        return;
      }
      setSaved("saved");
    });
  }

  return (
    <div className="rounded-lg border border-line bg-white/[0.035] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <Link href={`/questions/${loop.slug}`} className="text-base font-semibold text-white hover:text-signal">
          {loop.title}
        </Link>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as OpenLoopStatus)}
          className="rounded-md border border-line bg-ink/40 px-2 py-1 text-xs uppercase tracking-wide text-white focus:border-signal/50 focus:outline-none"
        >
          {openLoopStatuses.map((value) => (
            <option key={value} value={value}>
              {statusLabels[value]}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 grid gap-3">
        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-steel">Hypothesis</span>
          <textarea
            rows={2}
            value={hypothesis}
            onChange={(event) => setHypothesis(event.target.value)}
            className="mt-1 w-full rounded-md border border-line bg-ink/40 px-3 py-2 text-sm text-white placeholder:text-steel/60 focus:border-signal/50 focus:outline-none"
            placeholder="What do we currently believe the answer is?"
          />
        </label>
        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-steel">Evidence so far</span>
          <textarea
            rows={2}
            value={evidenceSummary}
            onChange={(event) => setEvidenceSummary(event.target.value)}
            className="mt-1 w-full rounded-md border border-line bg-ink/40 px-3 py-2 text-sm text-white placeholder:text-steel/60 focus:border-signal/50 focus:outline-none"
            placeholder="What have we actually learned toward answering this?"
          />
        </label>
        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-steel">Next action</span>
          <textarea
            rows={2}
            value={nextAction}
            onChange={(event) => setNextAction(event.target.value)}
            className="mt-1 w-full rounded-md border border-line bg-ink/40 px-3 py-2 text-sm text-white placeholder:text-steel/60 focus:border-signal/50 focus:outline-none"
            placeholder="What's the cheapest next step that would move this forward?"
          />
        </label>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={pending}
          className="rounded-md bg-signal px-4 py-2 text-sm font-semibold text-ink hover:bg-signal/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save"}
        </button>
        {saved === "saved" ? <span className="text-sm text-volt">Saved.</span> : null}
        {saved === "error" ? <span className="text-sm text-red-400">{error}</span> : null}
      </div>
    </div>
  );
}

export function OpenLoopsConsole({ initialLoops }: { initialLoops: Loop[] }) {
  if (initialLoops.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-line bg-white/[0.02] p-8 text-sm leading-6 text-steel">
        No open questions yet — they&apos;re raised automatically when a discovery surfaces one, not written ahead of time.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {initialLoops.map((loop) => (
        <LoopEditor key={loop.slug} loop={loop} />
      ))}
    </div>
  );
}
