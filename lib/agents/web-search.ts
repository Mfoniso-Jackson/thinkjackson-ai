import "server-only";

export type WebSearchResult = {
  title: string;
  url: string;
  content: string;
  score: number;
};

/**
 * Tavily, not a general search API — it's built for feeding LLM/agent
 * pipelines directly (clean extracted content per result, not raw SERP
 * HTML), which is exactly what the autonomous Scout needs downstream.
 *
 * search_depth "advanced" (2 API credits vs. 1 for "basic") trades a bit
 * more latency and quota for materially better-ranked results — worth it
 * at our volume (one cron search a day). Results are sorted by Tavily's
 * own relevance `score` so the caller processes the best matches first,
 * not just whatever order the API happened to return.
 */
export async function searchWeb(query: string, maxResults = 5): Promise<WebSearchResult[]> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    throw new Error("Autonomous Scout is not configured. Set TAVILY_API_KEY.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);

  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      signal: controller.signal,
      headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        query,
        max_results: maxResults,
        search_depth: "advanced"
      })
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(`Web search failed (${response.status}). ${body.slice(0, 200)}`.trim());
    }

    const payload = (await response.json()) as { results?: WebSearchResult[] };
    return (payload.results ?? []).sort((a, b) => b.score - a.score);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Web search timed out.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
