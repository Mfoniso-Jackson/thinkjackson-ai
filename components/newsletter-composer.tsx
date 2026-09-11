"use client";

import { useState, useTransition } from "react";
import { sendNewsletter } from "@/app/admin/newsletter/actions";

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Plain text in, a readable email out — paragraphs from blank lines, bare URLs auto-linked. No rich editor for this minimal version. */
function plainTextToHtml(text: string): string {
  return text
    .trim()
    .split(/\n{2,}/)
    .map((paragraph) => {
      const escaped = escapeHtml(paragraph.trim()).replace(/\n/g, "<br>");
      const linked = escaped.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1">$1</a>');
      return `<p>${linked}</p>`;
    })
    .join("\n");
}

export function NewsletterComposer({ subscriberCount }: { subscriberCount: number }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const html = plainTextToHtml(body);

  function handleSend() {
    setResult(null);
    startTransition(async () => {
      const outcome = await sendNewsletter(subject, html);
      if (!outcome.ok) {
        setResult({ ok: false, message: outcome.error });
        return;
      }
      setResult({
        ok: true,
        message: `Sent to ${outcome.data.sent} of ${outcome.data.recipientCount} subscriber${outcome.data.recipientCount === 1 ? "" : "s"}.${outcome.data.failed > 0 ? ` ${outcome.data.failed} failed.` : ""}`
      });
      setSubject("");
      setBody("");
    });
  }

  return (
    <div className="grid gap-6">
      <p className="text-sm text-steel">
        {subscriberCount} subscriber{subscriberCount === 1 ? "" : "s"} currently subscribed.
      </p>

      <div>
        <label className="block font-mono text-xs uppercase tracking-[0.18em] text-steel" htmlFor="subject">
          Subject
        </label>
        <input
          id="subject"
          type="text"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          className="mt-2 w-full rounded-md border border-line bg-ink/40 px-3 py-2 text-sm text-white placeholder:text-steel/60 focus:border-signal/50 focus:outline-none"
          placeholder="What's new at ThinkJackson"
        />
      </div>

      <div>
        <label className="block font-mono text-xs uppercase tracking-[0.18em] text-steel" htmlFor="body">
          Body (plain text — blank line for a new paragraph, URLs auto-link)
        </label>
        <textarea
          id="body"
          rows={12}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          className="mt-2 w-full rounded-md border border-line bg-ink/40 px-3 py-2 text-sm text-white placeholder:text-steel/60 focus:border-signal/50 focus:outline-none"
          placeholder={"New this week...\n\nSee the full graph at https://thinkjackson.com/discoveries"}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setShowPreview((value) => !value)}
          className="rounded-md border border-line px-4 py-2 text-sm font-semibold text-white hover:border-signal/40"
        >
          {showPreview ? "Hide preview" : "Preview"}
        </button>
        <button
          type="button"
          onClick={handleSend}
          disabled={pending || !subject.trim() || !body.trim()}
          className="rounded-md bg-signal px-4 py-2 text-sm font-semibold text-ink hover:bg-signal/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Sending…" : `Send to ${subscriberCount} subscriber${subscriberCount === 1 ? "" : "s"}`}
        </button>
      </div>

      {result ? (
        <p className={`text-sm ${result.ok ? "text-volt" : "text-red-400"}`}>{result.message}</p>
      ) : null}

      {showPreview ? (
        <div className="rounded-lg border border-line bg-white p-6 text-black">
          <p className="mb-4 border-b border-black/10 pb-3 text-xs uppercase tracking-wide text-black/50">Subject: {subject || "(no subject)"}</p>
          <div dangerouslySetInnerHTML={{ __html: html || "<p><em>(empty)</em></p>" }} />
        </div>
      ) : null}
    </div>
  );
}
