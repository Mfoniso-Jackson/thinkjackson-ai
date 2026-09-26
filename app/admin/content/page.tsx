import { AdminPageHeader } from "@/components/admin-sales";
import { ContentQueueConsole } from "@/components/content-queue-console";
import { fetchContentQueue } from "@/app/admin/content/actions";
import { isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const items = isSupabaseConfigured() ? await fetchContentQueue() : [];

  return (
    <div className="grid gap-10">
      <AdminPageHeader eyebrow="Content queue" title="What's being written.">
        <p>
          Launch posts, newsletter issues, and the operating loop&apos;s Signal/Research/Framework/Build categories — a
          real backlog moved by hand through idea → drafted → scheduled → published, not a scheduling engine.
        </p>
      </AdminPageHeader>
      {!isSupabaseConfigured() ? (
        <div className="rounded-lg border border-line bg-white/[0.035] p-6 text-sm text-steel">
          Supabase is not configured. Set <code>SUPABASE_URL</code> and <code>SUPABASE_SERVICE_ROLE_KEY</code>.
        </div>
      ) : (
        <ContentQueueConsole initialItems={items} />
      )}
    </div>
  );
}
