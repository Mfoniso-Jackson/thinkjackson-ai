"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { askQuestion, type AskState } from "@/app/ask/actions";
import { trackEvent } from "@/lib/analytics";

const initialState: AskState = { status: "idle" };

const examples = [
  "Who is researching agent identity?",
  "What are the unresolved questions around autonomous agents?",
  "How does agent identity connect to financial markets?",
  "What's the relationship between reinforcement learning and emergent behaviour?"
];

export function AskForm() {
  const [state, formAction, pending] = useActionState(askQuestion, initialState);

  useEffect(() => {
    if (state.status === "success") trackEvent("question_asked");
  }, [state.status]);

  return (
    <div className="grid gap-8">
      <form action={formAction} className="grid gap-4">
        <label className="block">
          <span className="sr-only">Ask ThinkJackson a question</span>
          <textarea
            name="question"
            rows={3}
            required
            defaultValue={state.question ?? ""}
            placeholder="Ask something about agents, financial intelligence, risk, or coordination..."
            className="w-full rounded-md border border-line bg-ink px-4 py-3 text-base text-white placeholder:text-steel/60 outline-none focus:border-signal"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="w-fit rounded-md bg-signal px-6 py-3 text-sm font-semibold text-ink transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-signal disabled:opacity-60"
        >
          {pending ? "Searching the graph…" : "Ask"}
        </button>
      </form>

      {state.status === "idle" ? (
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-steel">Try asking</p>
          <ul className="mt-3 grid gap-2">
            {examples.map((example) => (
              <li key={example} className="text-sm text-steel">
                &ldquo;{example}&rdquo;
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {state.status === "error" ? <p className="text-sm text-volt">{state.message}</p> : null}

      {state.status === "success" && state.answer ? (
        <div className="rounded-lg border border-line bg-white/[0.035] p-6">
          <p className="text-lg leading-8 text-white">{state.answer.answer}</p>

          {state.answer.concepts.length > 0 ? (
            <div className="mt-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal">Relevant concepts</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {state.answer.concepts.map((concept) => (
                  <Link
                    key={concept.key}
                    href={concept.href}
                    onClick={() => trackEvent("relationship_clicked", { source: "ask" })}
                    className="rounded-md border border-line px-3 py-1.5 text-xs text-white hover:border-signal/40"
                  >
                    {concept.title}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          {state.answer.sources.length > 0 ? (
            <div className="mt-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal">Sources</p>
              <ul className="mt-2 grid gap-1">
                {state.answer.sources.map((source) => (
                  <li key={source.url}>
                    <a href={source.url} target="_blank" rel="noreferrer" className="text-xs text-steel hover:text-white">
                      {source.title} →
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <Link href="/map" className="mt-6 inline-flex text-sm font-semibold text-signal hover:text-white">
            Explore the map →
          </Link>
        </div>
      ) : null}
    </div>
  );
}
