import type { MetadataRoute } from "next";
import { ideas, transIntelligence } from "@/data/ideas";
import { people } from "@/data/people";
import { publicVentures } from "@/data/ventures";
import { writingPosts } from "@/lib/writing";

const routes = [
  "",
  "/about",
  "/evidence",
  "/ideas",
  "/research",
  "/research/computational-superstition",
  "/people",
  "/podcast",
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
  `/ideas/${transIntelligence.slug}`,
  ...ideas.map((idea) => `/ideas/${idea.slug}`),
  ...people.map((person) => `/people/${person.slug}`),
  ...publicVentures.map((venture) => `/projects/${venture.slug}`),
  ...publicVentures.map((venture) => `/projects/${venture.slug}/deck`),
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
