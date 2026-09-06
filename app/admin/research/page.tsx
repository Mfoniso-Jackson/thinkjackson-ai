import { AdminPageHeader } from "@/components/admin-sales";
import { DiscoveryConsole } from "@/components/discovery-console";
import { listResearchCandidates } from "@/lib/kg-store";
import { isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function ResearchPipelinePage() {
  const candidates = await listResearchCandidates();

  return (
    <div className="grid gap-10">
      <AdminPageHeader eyebrow="Scout · Researcher · Librarian" title="Research pipeline.">
        <p>
          Paste a URL a human has already decided is worth investigating. Scout reads it, Researcher labels its
          claims and proposes connections to real ThinkJackson nodes, Librarian formats the proposal. Nothing
          publishes to the live graph without an explicit Approve below.
        </p>
      </AdminPageHeader>
      {!isSupabaseConfigured() ? (
        <div className="rounded-lg border border-line bg-white/[0.035] p-6 text-sm text-steel">
          Supabase is not configured. Set <code>SUPABASE_URL</code> and <code>SUPABASE_SERVICE_ROLE_KEY</code>.
        </div>
      ) : (
        <DiscoveryConsole initialCandidates={candidates} />
      )}
    </div>
  );
}
