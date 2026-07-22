import { requireExecutionOwner } from "@/lib/execution-auth";
import { listProjects } from "@/lib/execution-store";
import { MissionGenerator } from "@/components/mission-generator";

export default async function ExecutionPage() {
  const owner = await requireExecutionOwner();
  const projects = await listProjects(owner);
  return <div className="grid gap-10"><header className="max-w-3xl"><p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">Execution OS · Daily execution</p><h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">One outcome. Three tasks. Visible evidence.</h1><p className="mt-5 max-w-2xl text-base leading-7 text-steel">Turn today’s time, energy, and project reality into one evidence-producing mission.</p></header><MissionGenerator projects={projects} /></div>;
}
