import { AdminPageHeader } from "@/components/admin-sales";
import { OpenLoopsConsole } from "@/components/open-loops-console";
import { fetchOpenLoops } from "@/app/admin/questions/actions";
import { isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function AdminQuestionsPage() {
  const loops = isSupabaseConfigured() ? await fetchOpenLoops() : [];

  return (
    <div className="grid gap-10">
      <AdminPageHeader eyebrow="Open loops" title="Questions ThinkJackson is working.">
        <p>
          Every question a discovery raised, with a hypothesis, status, evidence gathered so far, and a next action —
          the record of an open loop actually being worked, not just a title sitting on a list.
        </p>
      </AdminPageHeader>
      {!isSupabaseConfigured() ? (
        <div className="rounded-lg border border-line bg-white/[0.035] p-6 text-sm text-steel">
          Supabase is not configured. Set <code>SUPABASE_URL</code> and <code>SUPABASE_SERVICE_ROLE_KEY</code>.
        </div>
      ) : (
        <OpenLoopsConsole initialLoops={loops} />
      )}
    </div>
  );
}
