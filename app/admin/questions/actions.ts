"use server";

import { requireExecutionOwner } from "@/lib/execution-auth";
import { listOpenLoops, updateOpenLoop } from "@/lib/kg-store";
import { openLoopStatuses, type OpenLoopMetadata, type OpenLoopStatus } from "@/lib/kg-types";
import type { PublishedNode } from "@/lib/kg-store";

export type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

export async function fetchOpenLoops(): Promise<Array<PublishedNode & { metadata: OpenLoopMetadata }>> {
  await requireExecutionOwner();
  return listOpenLoops();
}

export async function saveOpenLoop(
  slug: string,
  patch: { status: OpenLoopStatus; hypothesis: string; evidenceSummary: string; nextAction: string }
): Promise<ActionResult<null>> {
  try {
    await requireExecutionOwner();
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Authentication required." };
  }

  if (!openLoopStatuses.includes(patch.status)) {
    return { ok: false, error: "Invalid status." };
  }

  try {
    await updateOpenLoop(slug, {
      status: patch.status,
      hypothesis: patch.hypothesis.trim() || null,
      evidenceSummary: patch.evidenceSummary.trim() || null,
      nextAction: patch.nextAction.trim() || null
    });
    return { ok: true, data: null };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Could not save this open loop." };
  }
}
