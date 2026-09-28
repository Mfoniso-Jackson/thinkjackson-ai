"use client";

import { useActionState, useEffect } from "react";
import { submitToMap, type MapSubmissionState } from "@/app/submit/actions";
import { submissionCategories, type SubmissionCategory } from "@/lib/submission-form";
import { trackEvent } from "@/lib/analytics";

const categoryLabels: Record<SubmissionCategory, string> = {
  research: "Research",
  person: "Person",
  company: "Company",
  project: "Project",
  question: "Question",
  correction: "Correction"
};

const initialState: MapSubmissionState = { status: "idle", message: "" };

const fieldClass =
  "mt-1 w-full rounded-md border border-line bg-ink px-4 py-3 text-sm text-white placeholder:text-steel/60 outline-none focus:border-signal";

export function SubmitForm() {
  const [state, formAction, pending] = useActionState(submitToMap, initialState);

  useEffect(() => {
    if (state.status === "success") trackEvent("submission_completed");
  }, [state.status]);

  if (state.status === "success") {
    return <p className="rounded-lg border border-line bg-white/[0.035] p-6 text-base leading-7 text-white">{state.message}</p>;
  }

  return (
    <form action={formAction} className="grid gap-5">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <label className="block">
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-steel">What are you submitting?</span>
        <select name="category" defaultValue="research" className={fieldClass}>
          {submissionCategories.map((value) => (
            <option key={value} value={value}>
              {categoryLabels[value]}
            </option>
          ))}
        </select>
        {state.errors?.category ? <p className="mt-1 text-sm text-volt">{state.errors.category}</p> : null}
      </label>

      <label className="block">
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-steel">URL</span>
        <input name="url" type="url" required placeholder="https://..." className={fieldClass} />
        {state.errors?.url ? <p className="mt-1 text-sm text-volt">{state.errors.url}</p> : null}
      </label>

      <label className="block">
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-steel">Why does this matter?</span>
        <textarea name="reason" rows={3} required placeholder="What should ThinkJackson connect this to?" className={fieldClass} />
        {state.errors?.reason ? <p className="mt-1 text-sm text-volt">{state.errors.reason}</p> : null}
      </label>

      <label className="block">
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-steel">Your relationship to this work</span>
        <input name="relationship" type="text" required placeholder="e.g. I wrote it, I work there, I found it interesting" className={fieldClass} />
        {state.errors?.relationship ? <p className="mt-1 text-sm text-volt">{state.errors.relationship}</p> : null}
      </label>

      <label className="block">
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-steel">Email (optional — if you want to hear back)</span>
        <input name="contactEmail" type="email" placeholder="you@domain.com" className={fieldClass} />
        {state.errors?.contactEmail ? <p className="mt-1 text-sm text-volt">{state.errors.contactEmail}</p> : null}
      </label>

      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-md bg-signal px-6 py-3 text-sm font-semibold text-ink transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-signal disabled:opacity-60"
      >
        {pending ? "Submitting…" : "Submit to the map"}
      </button>

      {state.status === "error" ? (
        <p role="status" aria-live="polite" className="text-sm text-volt">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
