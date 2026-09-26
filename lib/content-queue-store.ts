import "server-only";
import { isSupabaseConfigured, supabaseInsert, supabaseRequest, supabaseUpdate } from "@/lib/supabase";
import type { ContentQueueItem, ContentStatus, ContentType } from "@/lib/content-queue-types";

type ContentQueueRow = {
  id: string;
  title: string;
  content_type: ContentType;
  status: ContentStatus;
  body: string | null;
  notes: string | null;
  published_url: string | null;
  created_at: string;
  updated_at: string;
};

function toItem(row: ContentQueueRow): ContentQueueItem {
  return {
    id: row.id,
    title: row.title,
    contentType: row.content_type,
    status: row.status,
    body: row.body,
    notes: row.notes,
    publishedUrl: row.published_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export async function listContentQueue(): Promise<ContentQueueItem[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const rows = (await supabaseRequest("content_queue?select=*&order=created_at.desc")) as ContentQueueRow[];
    return rows.map(toItem);
  } catch {
    return [];
  }
}

export async function createContentQueueItem(input: { title: string; contentType: ContentType }): Promise<ContentQueueItem> {
  const row = (await supabaseInsert("content_queue", {
    title: input.title,
    content_type: input.contentType,
    status: "idea"
  })) as ContentQueueRow;
  return toItem(row);
}

export async function updateContentQueueItem(
  id: string,
  patch: Partial<{ status: ContentStatus; body: string | null; notes: string | null; publishedUrl: string | null }>
): Promise<void> {
  const dbPatch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.status !== undefined) dbPatch.status = patch.status;
  if (patch.body !== undefined) dbPatch.body = patch.body;
  if (patch.notes !== undefined) dbPatch.notes = patch.notes;
  if (patch.publishedUrl !== undefined) dbPatch.published_url = patch.publishedUrl;
  await supabaseUpdate("content_queue", `id=eq.${id}`, dbPatch);
}
