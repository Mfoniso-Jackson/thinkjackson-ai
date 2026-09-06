"use client";

import { useActionState } from "react";
import { submitNewsletterSignup, type NewsletterSignupState } from "@/app/newsletter/actions";

const initialState: NewsletterSignupState = {
  status: "idle",
  message: ""
};

export function NewsletterForm({ sourcePage, className }: { sourcePage: string; className?: string }) {
  const [state, formAction, pending] = useActionState(submitNewsletterSignup, initialState);

  return (
    <form action={formAction} className={className}>
      <input type="hidden" name="sourcePage" value={sourcePage} />
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="newsletter-email">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="you@domain.com"
          className="w-full min-w-0 flex-1 rounded-md border border-line bg-ink px-4 py-3 text-sm text-white outline-none focus:border-signal"
        />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 rounded-md bg-signal px-5 py-3 text-sm font-semibold text-ink transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-signal disabled:opacity-60"
        >
          {pending ? "Joining..." : "Get the Intelligence Brief"}
        </button>
      </div>
      {state.status !== "idle" ? (
        <p className={`mt-3 text-sm ${state.status === "success" ? "text-signal" : "text-volt"}`}>{state.message}</p>
      ) : null}
    </form>
  );
}
