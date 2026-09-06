import "server-only";

export type WebSearchResult = {
  title: string;
  url: string;
  content: string;
};

/**
 * Tavily, not a general search API — it's built for feeding LLM/agent
 * pipelines directly (clean extracted content per result, not raw SERP
 * HTML), which is exactly what the autonomous Scout needs downstream.
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
        search_depth: "basic"
      })
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(`Web search failed (${response.status}). ${body.slice(0, 200)}`.trim());
    }

    const payload = (await response.json()) as { results?: WebSearchResult[] };
    return payload.results ?? [];
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Web search timed out.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
