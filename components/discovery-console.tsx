"use client";

import { useState, useTransition } from "react";
import { approveCandidate, rejectCandidate, runDiscoveryPipeline } from "@/app/admin/research/actions";
import type { ResearchCandidate, ResearchCandidateStatus } from "@/lib/kg-types";
import { epistemicStatusLabels } from "@/lib/graph/types";

const statusStyles: Record<ResearchCandidateStatus, string> = {
  discovered: "border-line bg-white/5 text-steel",
  investigating: "border-line bg-white/5 text-steel",
  verified: "border-volt/40 bg-volt/10 text-volt",
  published: "border-signal/40 bg-signal/10 text-signal",
  rejected: "border-line bg-white/5 text-steel"
};

export function DiscoveryConsole({ initialCandidates }: { initialCandidates: ResearchCandidate[] }) {
  const [url, setUrl] = useState("");
  const [candidates, setCandidates] = useState(initialCandidates);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [reviewPendingId, setReviewPendingId] = useState<string | null>(null);

  function handleDiscover() {
    setError(null);
    startTransition(async () => {
      const result = await runDiscoveryPipeline(url);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setCandidates((prev) => [result.data, ...prev]);
      setUrl("");
    });
  }

  async function handleApprove(id: string) {
    setReviewPendingId(id);
    const result = await approveCandidate(id);
    setReviewPendingId(null);
    if (result.ok) {
      setCandidates((prev) => prev.map((candidate) => (candidate.id === id ? result.data : candidate)));
    } else {
      setError(result.error);
    }
  }

  async function handleReject(id: string) {
    const reason = window.prompt("Why reject this candidate?") ?? "";
    setReviewPendingId(id);
    const result = await rejectCandidate(id, reason);
    setReviewPendingId(null);
    if (result.ok) {
      setCandidates((prev) =>
        prev.map((candidate) => (candidate.id === id ? { ...candidate, status: "rejected", rejectionReason: reason } : candidate))
      );
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="grid gap-8">
      <div className="rounded-lg border border-line bg-white/[0.035] p-6">
        <label className="text-sm font-medium text-white" htmlFor="discover-url">
          URL to investigate
        </label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input
            id="discover-url"
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://..."
            className="w-full min-w-0 flex-1 rounded-md border border-line bg-ink px-3 py-2 text-white outline-none focus:border-signal"
          />
          <button
            type="button"
            onClick={handleDiscover}
            disabled={pending || !url}
            className="shrink-0 rounded-md bg-signal px-5 py-2 text-sm font-semibold text-ink transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Investigating..." : "Run Scout → Researcher → Librarian"}
          </button>
        </div>
        <p className="mt-3 text-xs leading-5 text-steel">
          Scout fetches this one URL — nothing autonomous, nothing crawled. The result stops at &quot;verified&quot; until you approve it below.
        </p>
        {error ? (
          <p role="status" aria-live="polite" className="mt-3 rounded-md border border-volt/40 bg-volt/10 p-3 text-sm text-volt">
            {error}
          </p>
        ) : null}
      </div>

      <div className="grid gap-4">
        {candidates.length === 0 ? (
          <div className="rounded-lg border border-line bg-white/[0.035] p-6 text-sm text-steel">
            No research candidates yet. Paste a URL above to run the pipeline.
          </div>
        ) : (
          candidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              pending={reviewPendingId === candidate.id}
              onApprove={() => handleApprove(candidate.id)}
              onReject={() => handleReject(candidate.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function CandidateCard({
  candidate,
  pending,
  onApprove,
  onReject
}: {
  candidate: ResearchCandidate;
  pending: boolean;
  onApprove: () => void;
  onReject: () => void;
}) {
  const { scout, researcher, librarian } = candidate.payload;

  return (
    <div className="rounded-lg border border-line bg-white/[0.035] p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className={`inline-flex rounded-md border px-2 py-1 font-mono text-[11px] uppercase tracking-[0.1em] ${statusStyles[candidate.status]}`}>
            {candidate.status}
          </span>
          {candidate.payload.discoveryMethod === "autonomous" ? (
            <span className="ml-2 inline-flex rounded-md border border-signal/40 bg-signal/10 px-2 py-1 font-mono text-[11px] uppercase tracking-[0.1em] text-signal">
              found autonomously
            </span>
          ) : null}
          <h3 className="mt-3 text-lg font-semibold text-white">{candidate.title}</h3>
          <a href={candidate.payload.url} target="_blank" rel="noreferrer" className="text-xs text-signal hover:text-white">
            {candidate.payload.url}
          </a>
        </div>
        {candidate.status === "verified" ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onReject}
              disabled={pending}
              className="rounded-md border border-line px-3 py-1.5 text-xs font-semibold text-steel hover:border-volt/40 hover:text-volt disabled:opacity-60"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={onApprove}
              disabled={pending}
              className="rounded-md bg-signal px-3 py-1.5 text-xs font-semibold text-ink hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "Publishing..." : "Approve & publish"}
            </button>
          </div>
        ) : null}
      </div>

      <p className="mt-4 text-sm leading-6 text-steel">{scout.summary}</p>

      {candidate.status === "rejected" && candidate.rejectionReason ? (
        <p className="mt-3 text-xs text-steel">Rejected: {candidate.rejectionReason}</p>
      ) : null}

      {librarian?.possibleDuplicate ? (
        <div className="mt-4 rounded-md border border-volt/40 bg-volt/[0.06] p-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-volt">Possible duplicate</p>
          <p className="mt-2 text-sm leading-6 text-white">
            This looks similar to an existing published node:{" "}
            <span className="font-mono text-xs text-steel">
              {librarian.possibleDuplicate.type}:{librarian.possibleDuplicate.slug}
            </span>{" "}
            — &ldquo;{librarian.possibleDuplicate.title}&rdquo; ({Math.round(librarian.possibleDuplicate.similarity * 100)}% title overlap).
          </p>
        </div>
      ) : null}

      {librarian?.proposedPredictions && librarian.proposedPredictions.length > 0 ? (
        <div className="mt-4 rounded-md border border-volt/40 bg-volt/[0.06] p-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-volt">
            {candidate.status === "published" ? "Published" : "Approving this publishes"} {librarian.proposedPredictions.length} public prediction
            {librarian.proposedPredictions.length === 1 ? "" : "s"}
          </p>
          <div className="mt-3 grid gap-2">
            {librarian.proposedPredictions.map((prediction) => (
              <p key={prediction.slug} className="text-sm leading-6 text-white">
                &ldquo;{prediction.title}&rdquo;
              </p>
            ))}
          </div>
        </div>
      ) : null}

      {researcher ? (
        <details className="mt-4">
          <summary className="cursor-pointer text-xs font-semibold text-signal">
            {researcher.claims.length} claim{researcher.claims.length === 1 ? "" : "s"}, {researcher.proposedConnections.length} proposed connection
            {researcher.proposedConnections.length === 1 ? "" : "s"}
          </summary>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-steel">Claims</p>
              <div className="mt-2 grid gap-2">
                {researcher.claims.map((claim, index) => (
                  <div key={index} className="rounded-md border border-line bg-ink/40 p-3 text-xs leading-5 text-steel">
                    <span className="mr-2 rounded border border-line px-1.5 py-0.5 font-mono text-[10px] uppercase text-white">
                      {epistemicStatusLabels[claim.epistemicStatus]}
                    </span>
                    {claim.statement}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-steel">Proposed connections</p>
              <div className="mt-2 grid gap-2">
                {researcher.proposedConnections.map((connection, index) => (
                  <div key={index} className="rounded-md border border-line bg-ink/40 p-3 text-xs leading-5 text-steel">
                    <span className="font-mono text-white">{connection.relationType}</span> → {connection.targetType}:{connection.targetSlug}
                    <p className="mt-1 text-steel/80">{connection.rationale}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </details>
      ) : null}

      {librarian ? (
        <div className="mt-4 rounded-md border border-line bg-ink/40 p-3 text-xs leading-5 text-steel">
          <p>
            {candidate.status === "published" ? "Published" : "Will publish"} node:{" "}
            <span className="font-mono text-white">
              {librarian.proposedNode.type}:{librarian.proposedNode.slug}
            </span>
          </p>
          {librarian.proposedQuestion ? (
            <p className="mt-1">
              {candidate.status === "published" ? "Also published" : "Will also publish"} question node:{" "}
              <span className="font-mono text-white">
                {librarian.proposedQuestion.type}:{librarian.proposedQuestion.slug}
              </span>{" "}
              — &quot;{librarian.proposedQuestion.title}&quot;
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
