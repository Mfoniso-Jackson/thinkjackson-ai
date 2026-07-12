"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { submitSalesLead, type SalesLeadState } from "@/app/contact/actions";
import { leadIntentLabels, leadVentureOptions } from "@/data/sales-config";
import { trackEvent } from "@/lib/analytics";
import type { LeadIntent } from "@/lib/sales-types";

const initialState: SalesLeadState = {
  status: "idle",
  message: ""
};

const intentOptions = Object.entries(leadIntentLabels) as [LeadIntent, string][];

type SalesLeadFormProps = {
  defaultIntent?: LeadIntent;
  defaultVenture?: string;
  sourcePage?: string;
  campaign?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
};

function TextInput({
  label,
  name,
  type = "text",
  required,
  placeholder,
  error
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  error?: string;
}) {
  return (
    <label className="text-sm font-medium text-white">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full rounded-md border border-line bg-ink px-3 py-2 text-white outline-none focus:border-signal"
      />
      {error ? <span className="mt-1 block text-xs text-volt">{error}</span> : null}
    </label>
  );
}

function SelectInput({
  label,
  name,
  options,
  required,
  defaultValue,
  error,
  onChange
}: {
  label: string;
  name: string;
  options: readonly { label: string; value: string }[];
  required?: boolean;
  defaultValue?: string;
  error?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="text-sm font-medium text-white">
      {label}
      <select
        name={name}
        required={required}
        defaultValue={defaultValue ?? ""}
        onChange={(event) => onChange?.(event.target.value)}
        className="mt-2 w-full rounded-md border border-line bg-ink px-3 py-2 text-white outline-none focus:border-signal"
      >
        <option value="">Select one</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className="mt-1 block text-xs text-volt">{error}</span> : null}
    </label>
  );
}

export function SalesLeadForm({
  defaultIntent = "general",
  defaultVenture,
  sourcePage = "/contact",
  campaign,
  utmSource,
  utmMedium,
  utmCampaign
}: SalesLeadFormProps) {
  const [state, formAction, pending] = useActionState(submitSalesLead, initialState);
  const [intent, setIntent] = useState<LeadIntent>(defaultIntent);
  const [referrer, setReferrer] = useState("");
  const started = useRef(false);

  const submitLabel = useMemo(() => {
    if (intent === "investor") return "Request investor materials";
    if (intent === "pilot-partner") return "Discuss a pilot";
    if (intent === "research-collaborator") return "Start research conversation";
    if (intent === "grant-provider") return "Discuss grant fit";
    if (intent === "consulting") return "Request consulting conversation";
    return "Start conversation";
  }, [intent]);

  useEffect(() => {
    if (state.status === "success") {
      trackEvent("sales_lead_submitted", { intent, status: "success" });
    }
  }, [intent, state.status]);

  useEffect(() => {
    setReferrer(document.referrer);
  }, []);

  function markStarted() {
    if (!started.current) {
      started.current = true;
      trackEvent("sales_lead_form_started", { intent });
    }
  }

  return (
    <form action={formAction} onChange={markStarted} className="rounded-lg border border-line bg-white/[0.035] p-6">
      <input name="sourcePage" type="hidden" value={sourcePage} />
      <input name="campaign" type="hidden" value={campaign ?? ""} />
      <input name="utmSource" type="hidden" value={utmSource ?? ""} />
      <input name="utmMedium" type="hidden" value={utmMedium ?? ""} />
      <input name="utmCampaign" type="hidden" value={utmCampaign ?? ""} />
      <input name="referrer" type="hidden" value={referrer} />

      <div className="grid gap-4 md:grid-cols-2">
        <TextInput label="Full name" name="fullName" required error={state.errors?.fullName} />
        <TextInput label="Work email" name="email" type="email" required error={state.errors?.email} />
        <TextInput label="Organisation" name="organisation" required error={state.errors?.organisation} />
        <TextInput label="Role" name="role" placeholder="Founder, investor, operator, researcher..." />
        <TextInput label="Location or market" name="locationOrMarket" placeholder="UK, US, Africa, crypto, housing..." />
        <SelectInput
          label="Enquiry type"
          name="intent"
          required
          defaultValue={intent}
          options={intentOptions.map(([value, label]) => ({ value, label }))}
          error={state.errors?.intent}
          onChange={(value) => setIntent(value as LeadIntent)}
        />
        <SelectInput
          label="Venture of interest"
          name="ventureSlug"
          defaultValue={defaultVenture}
          options={leadVentureOptions}
        />
        <TextInput label="Preferred next step" name="preferredNextStep" placeholder="Call, demo, intro, proposal, grant conversation..." />
      </div>

      {intent === "investor" ? (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <TextInput label="Investor type" name="investorType" required placeholder="Angel, fund, family office, ecosystem fund..." error={state.errors?.investorType} />
          <TextInput label="Typical cheque size" name="chequeSize" placeholder="Optional range" />
          <TextInput label="Investment stage" name="investmentStage" placeholder="Angel, pre-seed, seed, grant..." />
          <TextInput label="Sectors of interest" name="sectorsOfInterest" placeholder="AI agents, fintech, infra, safety..." />
          <TextInput label="Preferred involvement" name="preferredInvolvement" placeholder="Capital, pilots, distribution, research..." />
          <label className="flex items-center gap-3 rounded-md border border-line bg-ink px-3 py-2 text-sm text-steel">
            <input name="requestInvestorMaterials" type="checkbox" className="h-4 w-4 accent-signal" />
            Request investor materials
          </label>
        </div>
      ) : null}

      {intent === "customer" || intent === "pilot-partner" || intent === "consulting" ? (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <TextInput label="Company type" name="companyType" placeholder="Fund, venue, proptech, enterprise, DAO..." />
          <TextInput label="Current workflow" name="currentWorkflow" placeholder="What happens today?" />
          <TextInput label="Primary pain point" name="primaryPainPoint" required error={state.errors?.primaryPainPoint} />
          <TextInput label="Team size" name="teamSize" />
          <TextInput label="Urgency" name="urgency" placeholder="Now, this quarter, exploratory..." />
          <TextInput label="Budget range" name="budgetRange" placeholder="Optional range" />
          <TextInput label="Pilot interest" name="pilotInterest" />
          <TextInput label="Preferred timeline" name="preferredTimeline" />
        </div>
      ) : null}

      {intent === "grant-provider" ? (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <TextInput label="Ecosystem or programme" name="ecosystemOrProgramme" required error={state.errors?.ecosystemOrProgramme} />
          <TextInput label="Grant category" name="grantCategory" />
          <TextInput label="Funding range" name="fundingRange" />
          <TextInput label="Application deadline" name="applicationDeadline" type="date" />
        </div>
      ) : null}

      {intent === "research-collaborator" ? (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <TextInput label="Institution" name="institution" />
          <TextInput label="Research area" name="researchArea" required error={state.errors?.researchArea} />
          <TextInput label="Collaboration type" name="collaborationType" placeholder="Experiment, paper, grant, review..." />
          <TextInput label="Funding availability" name="fundingAvailability" />
          <TextInput label="Publication or experiment interest" name="publicationOrExperimentInterest" />
        </div>
      ) : null}

      <label className="mt-5 block text-sm font-medium text-white">
        Message
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Describe the system, stakes, constraints, and the next commitment worth exploring."
          className="mt-2 w-full rounded-md border border-line bg-ink px-3 py-2 text-white outline-none focus:border-signal"
        />
        {state.errors?.message ? <span className="mt-1 block text-xs text-volt">{state.errors.message}</span> : null}
      </label>

      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <label className="mt-5 flex items-start gap-3 text-sm leading-6 text-steel">
        <input name="consent" type="checkbox" required className="mt-1 h-4 w-4 accent-signal" />
        <span>
          I consent to be contacted about this request. I understand this form does not provide confidential materials,
          financial advice, investment advice, or an offer to sell securities.
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
        {pending ? "Submitting..." : submitLabel}
      </button>
    </form>
  );
}
