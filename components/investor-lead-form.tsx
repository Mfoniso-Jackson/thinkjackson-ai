"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitInvestorLead, type InvestorLeadState } from "@/app/investors/actions";
import { publicVentures } from "@/data/ventures";
import { trackEvent } from "@/lib/analytics";

const initialState: InvestorLeadState = {
  status: "idle",
  message: ""
};

const investorTypes = [
  "Angel investor",
  "Venture fund",
  "Ecosystem fund",
  "Family office",
  "Grant provider",
  "Strategic partner",
  "Pilot customer",
  "Research collaborator"
] as const;

export function InvestorLeadForm() {
  const [state, formAction, pending] = useActionState(submitInvestorLead, initialState);
  const started = useRef(false);

  useEffect(() => {
    if (state.status === "success") {
      trackEvent("investor_form_submitted", { status: "success" });
    }
  }, [state.status]);

  function markStarted() {
    if (!started.current) {
      started.current = true;
      trackEvent("investor_form_started");
    }
  }

  return (
    <form action={formAction} onChange={markStarted} className="rounded-lg border border-line bg-white/[0.035] p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-white">
          Full name
          <input name="fullName" required className="mt-2 w-full rounded-md border border-line bg-ink px-3 py-2 text-white outline-none focus:border-signal" />
          {state.errors?.fullName ? <span className="mt-1 block text-xs text-volt">{state.errors.fullName}</span> : null}
        </label>
        <label className="text-sm font-medium text-white">
          Work email
          <input name="email" type="email" required className="mt-2 w-full rounded-md border border-line bg-ink px-3 py-2 text-white outline-none focus:border-signal" />
          {state.errors?.email ? <span className="mt-1 block text-xs text-volt">{state.errors.email}</span> : null}
        </label>
        <label className="text-sm font-medium text-white">
          Organisation
          <input name="organisation" required className="mt-2 w-full rounded-md border border-line bg-ink px-3 py-2 text-white outline-none focus:border-signal" />
          {state.errors?.organisation ? <span className="mt-1 block text-xs text-volt">{state.errors.organisation}</span> : null}
        </label>
        <label className="text-sm font-medium text-white">
          Role
          <input name="role" className="mt-2 w-full rounded-md border border-line bg-ink px-3 py-2 text-white outline-none focus:border-signal" />
        </label>
        <label className="text-sm font-medium text-white">
          Investor or partner type
          <select name="investorType" required className="mt-2 w-full rounded-md border border-line bg-ink px-3 py-2 text-white outline-none focus:border-signal">
            <option value="">Select one</option>
            {investorTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
          {state.errors?.investorType ? <span className="mt-1 block text-xs text-volt">{state.errors.investorType}</span> : null}
        </label>
        <label className="text-sm font-medium text-white">
          Typical cheque size (optional)
          <input name="chequeRange" placeholder="e.g. angel, grant, pilot budget" className="mt-2 w-full rounded-md border border-line bg-ink px-3 py-2 text-white outline-none focus:border-signal" />
        </label>
      </div>

      <fieldset className="mt-5">
        <legend className="text-sm font-medium text-white">Ventures of interest</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {publicVentures.map((venture) => (
            <label key={venture.slug} className="flex items-center gap-2 rounded-md border border-line bg-ink px-3 py-2 text-sm text-steel">
              <input name="venturesOfInterest" type="checkbox" value={venture.slug} className="h-4 w-4 accent-signal" />
              {venture.name}
            </label>
          ))}
        </div>
        {state.errors?.venturesOfInterest ? <span className="mt-2 block text-xs text-volt">{state.errors.venturesOfInterest}</span> : null}
      </fieldset>

      <label className="mt-5 block text-sm font-medium text-white">
        Areas of interest
        <input name="areasOfInterest" placeholder="AI agents, fintech, proptech, grants, pilots..." className="mt-2 w-full rounded-md border border-line bg-ink px-3 py-2 text-white outline-none focus:border-signal" />
      </label>

      <label className="mt-5 block text-sm font-medium text-white">
        Preferred involvement
        <input name="involvementType" placeholder="Investor, pilot partner, research sponsor, strategic distribution..." className="mt-2 w-full rounded-md border border-line bg-ink px-3 py-2 text-white outline-none focus:border-signal" />
      </label>

      <label className="mt-5 block text-sm font-medium text-white">
        Message
        <textarea name="message" required rows={5} className="mt-2 w-full rounded-md border border-line bg-ink px-3 py-2 text-white outline-none focus:border-signal" />
        {state.errors?.message ? <span className="mt-1 block text-xs text-volt">{state.errors.message}</span> : null}
      </label>

      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <label className="mt-5 flex items-start gap-3 text-sm leading-6 text-steel">
        <input name="consent" type="checkbox" required className="mt-1 h-4 w-4 accent-signal" />
        <span>
          I consent to be contacted about this request. I understand this form does not provide confidential materials,
          financial advice, or an offer to sell securities.
        </span>
      </label>
      {state.errors?.consent ? <span className="mt-2 block text-xs text-volt">{state.errors.consent}</span> : null}

      {state.message ? (
        <p className={`mt-5 rounded-md border p-3 text-sm ${state.status === "success" ? "border-signal/40 text-signal" : "border-volt/40 text-volt"}`}>
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-signal px-5 py-3 text-sm font-semibold text-ink transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? "Submitting..." : "Request investor materials"}
      </button>
    </form>
  );
}
