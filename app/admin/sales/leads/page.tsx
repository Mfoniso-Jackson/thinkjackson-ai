import { AdminPageHeader, EmptyAdminState } from "@/components/admin-sales";
import { LeadStatusButtons, PromoteLeadForm } from "@/components/sales-admin-forms";
import { leadIntentLabels } from "@/data/sales-config";
import { listSalesLeads } from "@/lib/sales-store";
import type { QualificationBand } from "@/lib/sales-types";
import { formatDate } from "@/lib/utils";
import { isSupabaseConfigured } from "@/lib/supabase";

const bandStyles: Record<QualificationBand, string> = {
  A: "border-signal/40 bg-signal/10 text-signal",
  B: "border-line bg-white/5 text-white",
  C: "border-volt/40 bg-volt/10 text-volt",
  D: "border-line bg-white/5 text-steel"
};

export const dynamic = "force-dynamic";

export default async function SalesLeadsPage() {
  const leads = await listSalesLeads();

  return (
    <div className="grid gap-10">
      <AdminPageHeader eyebrow="Leads" title="Segmented inbound demand.">
        <p>Leads captured from the public form include source page, venture, campaign, referrer, UTM context, and qualification score.</p>
      </AdminPageHeader>

      {!isSupabaseConfigured() ? (
        <EmptyAdminState
          title="Supabase is not configured."
          detail="Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to read from public.sales_leads."
        />
      ) : leads.length === 0 ? (
        <EmptyAdminState title="No leads yet." detail="Submissions from /contact and /investors will appear here as soon as one comes in." />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-line">
          <table className="w-full min-w-[860px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line bg-white/[0.02] text-left">
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-steel">Received</th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-steel">Contact</th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-steel">Intent</th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-steel">Qualification</th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-steel">Source</th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-steel">Next step</th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-steel">Action</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-line last:border-b-0 align-top">
                  <td className="whitespace-nowrap px-4 py-4 text-steel">{formatDate(lead.createdAt)}</td>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-white">{lead.fullName}</p>
                    <p className="mt-1 text-xs text-steel">{lead.email}</p>
                    {lead.organisation ? <p className="text-xs text-steel">{lead.organisation}</p> : null}
                    {lead.message ? (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-xs font-semibold text-signal">Message</summary>
                        <p className="mt-2 max-w-md text-xs leading-5 text-steel">{lead.message}</p>
                      </details>
                    ) : null}
                  </td>
                  <td className="px-4 py-4">
                    <span className="rounded-md border border-line bg-white/5 px-2 py-1 font-mono text-[11px] text-steel">
                      {leadIntentLabels[lead.intent] ?? lead.intent}
                    </span>
                    {lead.ventureSlug ? <p className="mt-2 text-xs text-steel">{lead.ventureSlug}</p> : null}
                  </td>
                  <td className="px-4 py-4">
                    {lead.qualification ? (
                      <>
                        <span
                          className={`inline-flex rounded-md border px-2 py-1 font-mono text-[11px] ${bandStyles[lead.qualification.band]}`}
                        >
                          Band {lead.qualification.band} · {lead.qualification.total}
                        </span>
                        {lead.qualification.missingInformation.length > 0 ? (
                          <p className="mt-2 max-w-xs text-xs text-steel">
                            Missing: {lead.qualification.missingInformation.join(", ")}
                          </p>
                        ) : null}
                      </>
                    ) : (
                      <span className="text-xs text-steel">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-xs text-steel">
                    <p>{lead.sourcePage ?? "—"}</p>
                    {lead.campaign ? <p className="mt-1">{lead.campaign}</p> : null}
                  </td>
                  <td className="px-4 py-4 text-xs text-steel">{lead.preferredNextStep ?? "—"}</td>
                  <td className="min-w-[260px] px-4 py-4">
                    <div className="grid gap-2">
                      {lead.status !== "converted" ? <PromoteLeadForm lead={lead} /> : null}
                      <LeadStatusButtons lead={lead} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
