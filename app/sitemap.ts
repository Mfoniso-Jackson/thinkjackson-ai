import type { MetadataRoute } from "next";
import { publicVentures } from "@/data/ventures";
import { writingPosts } from "@/lib/writing";

const routes = [
  "",
  "/about",
  "/evidence",
  "/research",
  "/research/computational-superstition",
  "/products",
  "/projects",
  "/investors",
  "/writing",
  "/timeline",
  "/now",
  "/consulting",
  "/contact",
  "/privacy",
  "/site-notice",
  "/rss.xml",
  ...publicVentures.map((venture) => `/projects/${venture.slug}`),
  ...writingPosts.map((post) => `/writing/${post.slug}`)
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `https://thinkjackson.com${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8
  }));
}
