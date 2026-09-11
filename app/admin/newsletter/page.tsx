import { AdminPageHeader } from "@/components/admin-sales";
import { NewsletterComposer } from "@/components/newsletter-composer";
import { getSubscriberCount } from "@/app/admin/newsletter/actions";
import { isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function AdminNewsletterPage() {
  const configured = isSupabaseConfigured() && Boolean(process.env.RESEND_API_KEY) && Boolean(process.env.NEWSLETTER_FROM_EMAIL);
  const subscriberCount = isSupabaseConfigured() ? await getSubscriberCount() : 0;

  return (
    <div className="grid gap-10">
      <AdminPageHeader eyebrow="The Intelligence Brief" title="Newsletter.">
        <p>
          Sends immediately to every subscribed address via Resend, with an unsubscribe link stamped into every
          copy. No drafts are saved — write, preview, send.
        </p>
      </AdminPageHeader>
      {!configured ? (
        <div className="rounded-lg border border-line bg-white/[0.035] p-6 text-sm text-steel">
          Not fully configured yet. Requires <code>SUPABASE_URL</code>/<code>SUPABASE_SERVICE_ROLE_KEY</code>,{" "}
          <code>RESEND_API_KEY</code>, and <code>NEWSLETTER_FROM_EMAIL</code>.
        </div>
      ) : (
        <NewsletterComposer subscriberCount={subscriberCount} />
      )}
    </div>
  );
}
