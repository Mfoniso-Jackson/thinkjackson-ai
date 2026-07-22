import Link from "next/link";
import type { ReactNode } from "react";
import { emptyPipelineMessage, getPipelineOverview } from "@/data/sales-dashboard";
import { pipelineStages } from "@/data/sales-config";

export const adminSalesNav = [
  { label: "Execution", href: "/admin/execution" },
  { label: "Overview", href: "/admin/sales" },
  { label: "Today", href: "/admin/sales/today" },
  { label: "Leads", href: "/admin/sales/leads" },
  { label: "Opportunities", href: "/admin/sales/opportunities" },
  { label: "Pipeline", href: "/admin/sales/pipeline" },
  { label: "Tasks", href: "/admin/sales/tasks" },
  { label: "Proposals", href: "/admin/sales/proposals" },
  { label: "Evidence", href: "/admin/sales/evidence" },
  { label: "Campaigns", href: "/admin/sales/campaigns" },
  { label: "Analytics", href: "/admin/sales/analytics" },
  { label: "Review", href: "/admin/sales/review" }
] as const;

export function AdminSalesNav() {
  return (
    <nav className="flex gap-2 overflow-x-auto border-b border-line pb-4" aria-label="Sales admin navigation">
      {adminSalesNav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="whitespace-nowrap rounded-md border border-line px-3 py-2 text-sm text-steel hover:border-signal/40 hover:text-white"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function AdminPageHeader({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <div className="max-w-4xl">
      <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">{eyebrow}</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">{title}</h1>
      {children ? <div className="mt-4 text-base leading-7 text-steel">{children}</div> : null}
    </div>
  );
}

export function EmptyAdminState({ title = "No private records connected yet.", detail = emptyPipelineMessage }: { title?: string; detail?: string }) {
  return (
    <div className="rounded-lg border border-line bg-white/[0.035] p-6">
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-signal">Empty state</p>
      <h2 className="mt-3 text-xl font-semibold text-white">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-steel">{detail}</p>
    </div>
  );
}

export function PipelineMetricGrid() {
  const overview = getPipelineOverview();
  const metrics = [
    ["Active leads", overview.totalActiveLeads],
    ["Qualified opportunities", overview.qualifiedOpportunities],
    ["Meetings scheduled", overview.meetingsScheduled],
    ["Proposals sent", overview.proposalsSent],
    ["Pipeline value", `£${overview.pipelineValue.toLocaleString()}`],
    ["Weighted value", `£${overview.weightedValue.toLocaleString()}`],
    ["Overdue follow-ups", overview.overdueFollowUps],
    ["Recently won", overview.recentlyWon],
    ["Stalled", overview.stalledOpportunities]
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {metrics.map(([label, value]) => (
        <div key={label} className="rounded-lg border border-line bg-white/[0.035] p-5">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-steel">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
        </div>
      ))}
    </div>
  );
}

export function PipelineStageGrid() {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {pipelineStages.map((stage) => (
        <div key={stage.value} className="rounded-lg border border-line bg-white/[0.035] p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-white">{stage.label}</h2>
            <span className="rounded-md border border-line px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-steel">
              {stage.active ? "Active" : "Terminal"}
            </span>
          </div>
          <p className="mt-4 text-sm leading-6 text-steel">0 records</p>
        </div>
      ))}
    </div>
  );
}
