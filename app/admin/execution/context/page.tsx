import { requireExecutionOwner } from "@/lib/execution-auth";
import { listProjects } from "@/lib/execution-store";
import { ProjectContextEditor } from "@/components/project-context-editor";

export default async function ContextPage() {
  const owner = await requireExecutionOwner(); const projects = await listProjects(owner);
  return <div className="grid gap-8"><header className="max-w-3xl"><p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">Project intelligence</p><h1 className="mt-4 text-4xl font-semibold text-white">Project context</h1><p className="mt-4 leading-7 text-steel">Keep strategy, risks, assumptions, and current constraints accurate. Mission generation uses this context.</p></header><ProjectContextEditor projects={projects} /></div>;
}
