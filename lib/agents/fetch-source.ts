import "server-only";

export type FetchedSource = {
  url: string;
  text: string;
  retrievedAt: string;
};

const MAX_EXCERPT_LENGTH = 8000;
const MIN_READABLE_LENGTH = 200;

/**
 * A plain regex-based tag strip, not a real readability extraction. It
 * won't cleanly separate article text from nav/footer boilerplate the way
 * a library like @mozilla/readability would — that's a real, known
 * limitation, acceptable for proving the pipeline works, worth revisiting
 * once the loop is running end to end and quality actually matters.
 */
function extractReadableText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Scraped pages routinely carry "smart" punctuation (curly quotes, en/em
 * dashes, bullets, ellipses) outside the Latin-1 range. In production only
 * (never reproduced locally), those characters have caused agent calls to
 * fail with "Cannot convert argument to a ByteString because the character
 * at index N has a value of M which is greater than 255" — confirmed via
 * production agent_logs rows where the offending value (8226) is exactly
 * U+2022 BULLET. Normalizing to ASCII here, once, at the point content
 * enters the pipeline, is cheaper and more robust than chasing which
 * downstream fetch/header call is doing the ByteString conversion.
 */
function normalizeToAscii(text: string): string {
  return text
    .replace(/[‘’‚′]/g, "'") // curly single quotes, low-9 quote, prime
    .replace(/[“”„″]/g, '"') // curly double quotes, low-9 quote, double prime
    .replace(/[–—]/g, "-") // en dash, em dash
    .replace(/…/g, "...") // horizontal ellipsis
    .replace(/[•‣◦⁃∙]/g, "-") // bullet variants
    .replace(/[  -​ 　]/g, " ") // nbsp and other unicode spaces
    .replace(/[^\x00-\xFF]/g, ""); // anything else above Latin-1 — the confirmed ByteString threshold
}

export async function fetchSourceText(url: string): Promise<FetchedSource> {
  const parsed = new URL(url);
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("Only http/https URLs can be fetched.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { "user-agent": "ThinkJacksonScout/1.0 (+https://thinkjackson.com)" }
    });

    if (!response.ok) {
      throw new Error(`Could not fetch the source (${response.status}).`);
    }

    const html = await response.text();
    const text = normalizeToAscii(extractReadableText(html)).slice(0, MAX_EXCERPT_LENGTH);

    if (text.length < MIN_READABLE_LENGTH) {
      throw new Error("The fetched page did not contain enough readable text to investigate.");
    }

    return { url, text, retrievedAt: new Date().toISOString() };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Fetching the source timed out.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
