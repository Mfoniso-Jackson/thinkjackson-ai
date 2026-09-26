"use client";

import { useState, useTransition } from "react";
import { addContentQueueItem, saveContentQueueItem } from "@/app/admin/content/actions";
import { contentStatuses, contentTypes, type ContentQueueItem, type ContentStatus, type ContentType } from "@/lib/content-queue-types";

const typeLabels: Record<ContentType, string> = {
  launch: "Launch",
  newsletter: "Newsletter",
  signal: "Signal",
  research: "Research",
  framework: "Framework",
  build: "Build"
};

const statusLabels: Record<ContentStatus, string> = {
  idea: "Idea",
  drafted: "Drafted",
  scheduled: "Scheduled",
  published: "Published"
};

function ItemEditor({ item }: { item: ContentQueueItem }) {
  const [status, setStatus] = useState<ContentStatus>(item.status);
  const [body, setBody] = useState(item.body ?? "");
  const [notes, setNotes] = useState(item.notes ?? "");
  const [publishedUrl, setPublishedUrl] = useState(item.publishedUrl ?? "");
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState<"idle" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  function handleSave() {
    setSaved("idle");
    setError(null);
    startTransition(async () => {
      const result = await saveContentQueueItem(item.id, { status, body, notes, publishedUrl });
      if (!result.ok) {
        setSaved("error");
        setError(result.error);
        return;
      }
      setSaved("saved");
    });
  }

  return (
    <div className="rounded-lg border border-line bg-white/[0.035] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-signal">{typeLabels[item.contentType]}</span>
          <h3 className="mt-1 text-base font-semibold text-white">{item.title}</h3>
        </div>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as ContentStatus)}
          className="rounded-md border border-line bg-ink/40 px-2 py-1 text-xs uppercase tracking-wide text-white focus:border-signal/50 focus:outline-none"
        >
          {contentStatuses.map((value) => (
            <option key={value} value={value}>
              {statusLabels[value]}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 grid gap-3">
        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-steel">Body / draft</span>
          <textarea
            rows={6}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            className="mt-1 w-full rounded-md border border-line bg-ink/40 px-3 py-2 text-sm text-white placeholder:text-steel/60 focus:border-signal/50 focus:outline-none"
            placeholder="The actual copy, draft, or content for this item."
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-steel">Notes</span>
            <textarea
              rows={2}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="mt-1 w-full rounded-md border border-line bg-ink/40 px-3 py-2 text-sm text-white placeholder:text-steel/60 focus:border-signal/50 focus:outline-none"
              placeholder="Context, sequencing, or what's blocking this."
            />
          </label>
          <label className="block">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-steel">Published URL</span>
            <input
              type="text"
              value={publishedUrl}
              onChange={(event) => setPublishedUrl(event.target.value)}
              className="mt-1 w-full rounded-md border border-line bg-ink/40 px-3 py-2 text-sm text-white placeholder:text-steel/60 focus:border-signal/50 focus:outline-none"
              placeholder="https://..."
            />
          </label>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={pending}
          className="rounded-md bg-signal px-4 py-2 text-sm font-semibold text-ink hover:bg-signal/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save"}
        </button>
        {saved === "saved" ? <span className="text-sm text-volt">Saved.</span> : null}
        {saved === "error" ? <span className="text-sm text-red-400">{error}</span> : null}
      </div>
    </div>
  );
}

function AddItemForm({ onAdded }: { onAdded: (item: ContentQueueItem) => void }) {
  const [title, setTitle] = useState("");
  const [contentType, setContentType] = useState<ContentType>("launch");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleAdd() {
    setError(null);
    startTransition(async () => {
      const result = await addContentQueueItem(title, contentType);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      onAdded(result.data);
      setTitle("");
    });
  }

  return (
    <div className="rounded-lg border border-dashed border-line bg-white/[0.02] p-5">
      <div className="flex flex-wrap items-end gap-3">
        <label className="block flex-1 min-w-[240px]">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-steel">New item</span>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="mt-1 w-full rounded-md border border-line bg-ink/40 px-3 py-2 text-sm text-white placeholder:text-steel/60 focus:border-signal/50 focus:outline-none"
            placeholder="e.g. First newsletter issue"
          />
        </label>
        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-steel">Type</span>
          <select
            value={contentType}
            onChange={(event) => setContentType(event.target.value as ContentType)}
            className="mt-1 rounded-md border border-line bg-ink/40 px-2 py-2 text-sm text-white focus:border-signal/50 focus:outline-none"
          >
            {contentTypes.map((value) => (
              <option key={value} value={value}>
                {typeLabels[value]}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={handleAdd}
          disabled={pending || !title.trim()}
          className="rounded-md bg-signal px-4 py-2 text-sm font-semibold text-ink hover:bg-signal/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Adding…" : "Add"}
        </button>
      </div>
      {error ? <p className="mt-2 text-sm text-red-400">{error}</p> : null}
    </div>
  );
}

export function ContentQueueConsole({ initialItems }: { initialItems: ContentQueueItem[] }) {
  const [items, setItems] = useState(initialItems);

  return (
    <div className="grid gap-4">
      <AddItemForm onAdded={(item) => setItems((current) => [item, ...current])} />
      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-line bg-white/[0.02] p-8 text-sm leading-6 text-steel">
          Nothing queued yet — add the first item above.
        </div>
      ) : (
        items.map((item) => <ItemEditor key={item.id} item={item} />)
      )}
    </div>
  );
}
