import "server-only";

/**
 * A thin wrapper around Supabase's PostgREST API using plain fetch — the
 * same approach lib/execution-store.ts already uses, so this doesn't add
 * @supabase/supabase-js as a dependency just for a handful of inserts.
 * Always uses the service role key: every table this touches has RLS
 * locked to service_role only, so there is no anon-key code path here.
 */
function config() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ""), key };
}

export function isSupabaseConfigured() {
  return config() !== null;
}

export async function supabaseRequest(path: string, init: RequestInit = {}) {
  const configured = config();
  if (!configured) {
    throw new Error("Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }

  const response = await fetch(`${configured.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: configured.key,
      authorization: `Bearer ${configured.key}`,
      "content-type": "application/json",
      prefer: "return=representation",
      ...init.headers
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Supabase request failed (${response.status}): ${body}`);
  }

  if (response.status === 204) return [];
  return response.json();
}

export async function supabaseInsert(table: string, row: Record<string, unknown>) {
  const rows = (await supabaseRequest(table, {
    method: "POST",
    body: JSON.stringify(row)
  })) as unknown[];
  return rows[0];
}

/** Insert-or-update by a unique column, for things like an email signup that can be submitted twice. */
export async function supabaseUpsert(table: string, row: Record<string, unknown>, conflictColumn: string) {
  const rows = (await supabaseRequest(`${table}?on_conflict=${conflictColumn}`, {
    method: "POST",
    headers: { prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(row)
  })) as unknown[];
  return rows[0];
}
