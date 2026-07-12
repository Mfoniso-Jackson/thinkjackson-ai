import { writingPosts } from "@/lib/writing";

const siteUrl = "https://thinkjackson.com";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function GET() {
  const items = writingPosts
    .map((post) => {
      const url = `${siteUrl}/writing/${post.slug}`;

      return `
        <item>
          <title>${escapeXml(post.title)}</title>
          <link>${url}</link>
          <guid>${url}</guid>
          <description>${escapeXml(post.excerpt)}</description>
          <pubDate>${new Date(post.date).toUTCString()}</pubDate>
        </item>`;
    })
    .join("");

  const feed = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>thinkjackson Writing</title>
        <link>${siteUrl}/writing</link>
        <description>Research notes on AI systems, markets, agents, and human coordination by Mfoniso Jackson.</description>
        <language>en</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        ${items}
      </channel>
    </rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8"
    }
  });
}
