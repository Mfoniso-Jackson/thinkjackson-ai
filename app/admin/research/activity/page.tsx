import { AdminPageHeader, EmptyAdminState } from "@/components/admin-sales";
import { listAgentLogs } from "@/lib/kg-store";
import { isSupabaseConfigured } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ResearchActivityPage() {
  const logs = await listAgentLogs();

  const total = logs.length;
  const succeeded = logs.filter((log) => log.requestSuccess).length;
  const failed = total - succeeded;
  const byAgent = logs.reduce<Record<string, number>>((counts, log) => {
    counts[log.agent] = (counts[log.agent] ?? 0) + 1;
    return counts;
  }, {});
  const latencies = logs.filter((log) => log.latencyMs !== null).map((log) => log.latencyMs as number);
  const avgLatency = latencies.length > 0 ? Math.round(latencies.reduce((sum, value) => sum + value, 0) / latencies.length) : null;

  return (
    <div className="grid gap-10">
      <AdminPageHeader eyebrow="Observability" title="Agent activity.">
        <p>
          Every Scout, Researcher, and Librarian call logs here — model, latency, and whether it succeeded — the
          same way the founder execution OS already logs its own AI calls. Nothing on this page is estimated.
        </p>
      </AdminPageHeader>

      {!isSupabaseConfigured() ? (
        <EmptyAdminState title="Supabase is not configured." detail="Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to read from public.agent_logs." />
      ) : total === 0 ? (
        <EmptyAdminState title="No agent runs yet." detail="Run the discovery pipeline once from the Discover tab and this page will show it." />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              ["Total calls", total],
              ["Succeeded", succeeded],
              ["Failed", failed],
              ["Avg latency", avgLatency !== null ? `${avgLatency}ms` : "—"]
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-line bg-white/[0.035] p-5">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-steel">{label}</p>
                <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {Object.entries(byAgent).map(([agent, count]) => (
              <div key={agent} className="rounded-lg border border-line bg-white/[0.035] p-4">
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-signal">{agent}</p>
                <p className="mt-2 text-xl font-semibold text-white">{count} call{count === 1 ? "" : "s"}</p>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto rounded-lg border border-line">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-line bg-white/[0.02] text-left">
                  <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-steel">Time</th>
                  <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-steel">Agent</th>
                  <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-steel">Model</th>
                  <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-steel">Latency</th>
                  <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-steel">Result</th>
                  <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-steel">Error</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-line last:border-b-0">
                    <td className="whitespace-nowrap px-4 py-3 text-steel">{formatDate(log.createdAt)}</td>
                    <td className="px-4 py-3 font-mono text-xs text-white">{log.agent}</td>
                    <td className="px-4 py-3 text-xs text-steel">{log.model ?? "—"}</td>
                    <td className="px-4 py-3 text-xs text-steel">{log.latencyMs !== null ? `${log.latencyMs}ms` : "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-md border px-2 py-1 font-mono text-[11px] ${
                          log.requestSuccess ? "border-signal/40 bg-signal/10 text-signal" : "border-volt/40 bg-volt/10 text-volt"
                        }`}
                      >
                        {log.requestSuccess ? "success" : "failed"}
                      </span>
                    </td>
                    <td className="max-w-xs px-4 py-3 text-xs text-steel">{log.errorCode ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
