import "server-only";

/**
 * Structured-output providers (confirmed on Gemini, and not something to
 * assume is provider-specific) can hard-truncate a generated string right
 * at the JSON schema's maxLength instead of regenerating within budget,
 * producing output that's schema-valid but content-corrupted — seen in
 * production as a Scout summary cut off mid-sentence with stray non-ASCII
 * bytes at the cut point, landing exactly at the field's length cap. The
 * schemas in scout.ts and researcher.ts set maxLength with headroom above
 * the real Zod cap in lib/kg-types.ts so ordinary output never brushes the
 * boundary; this is the backstop for the rare case where a field still
 * lands right on that raised boundary without a clean sentence ending. It
 * throws, and because it runs inside the `parse` callback passed to
 * generate() (lib/ai/runtime.ts), the throw is caught by the same
 * try/catch that runWithFallback (lib/ai/fallback.ts) uses to move to the
 * next provider — so a truncated field gets retried on a different
 * provider rather than silently published.
 */
const SENTENCE_END = /[.!?"'”’)\]]\s*$/;

export function assertFieldNotTruncated(fieldLabel: string, value: string | undefined, schemaMaxLength: number): void {
  if (!value) return;
  const nearSchemaLimit = value.length >= schemaMaxLength - 2;
  if (nearSchemaLimit && !SENTENCE_END.test(value)) {
    throw new Error(
      `${fieldLabel} looks truncated by the provider's structured-output mode ` +
        `(length ${value.length} of ${schemaMaxLength} schema max, no sentence-ending punctuation). Retrying on the next provider.`
    );
  }
}
