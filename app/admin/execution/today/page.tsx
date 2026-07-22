import Link from "next/link";
import { requireExecutionOwner } from "@/lib/execution-auth";
import { getActiveMission } from "@/lib/execution-store";
import { ActiveMission } from "@/components/active-mission";

export default async function TodayPage() {
  const owner = await requireExecutionOwner(); const mission = await getActiveMission(owner);
  return <div className="grid gap-8"><header><p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">Today</p><h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">Current mission</h1></header>{mission ? <ActiveMission mission={mission} /> : <div className="rounded-lg border border-dashed border-line p-10 text-center"><h2 className="text-xl font-semibold text-white">No active mission</h2><p className="mt-2 text-sm text-steel">Generate one focused mission before starting work.</p><Link href="/admin/execution" className="mt-5 inline-flex min-h-11 items-center rounded-md bg-signal px-5 text-sm font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Generate today’s mission</Link></div>}</div>;
}
