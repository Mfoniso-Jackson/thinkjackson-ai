"use server";

import { requireExecutionOwner } from "@/lib/execution-auth";
import { createContentQueueItem, listContentQueue, updateContentQueueItem } from "@/lib/content-queue-store";
import { contentStatuses, contentTypes, type ContentQueueItem, type ContentStatus, type ContentType } from "@/lib/content-queue-types";

export type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

export async function fetchContentQueue(): Promise<ContentQueueItem[]> {
  await requireExecutionOwner();
  return listContentQueue();
}

export async function addContentQueueItem(title: string, contentType: ContentType): Promise<ActionResult<ContentQueueItem>> {
  try {
    await requireExecutionOwner();
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Authentication required." };
  }
  if (!title.trim()) return { ok: false, error: "Title is required." };
  if (!contentTypes.includes(contentType)) return { ok: false, error: "Invalid content type." };

  try {
    const item = await createContentQueueItem({ title: title.trim(), contentType });
    return { ok: true, data: item };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Could not add this item." };
  }
}

export async function saveContentQueueItem(
  id: string,
  patch: { status: ContentStatus; body: string; notes: string; publishedUrl: string }
): Promise<ActionResult<null>> {
  try {
    await requireExecutionOwner();
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Authentication required." };
  }
  if (!contentStatuses.includes(patch.status)) return { ok: false, error: "Invalid status." };

  try {
    await updateContentQueueItem(id, {
      status: patch.status,
      body: patch.body.trim() || null,
      notes: patch.notes.trim() || null,
      publishedUrl: patch.publishedUrl.trim() || null
    });
    return { ok: true, data: null };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Could not save this item." };
  }
}
