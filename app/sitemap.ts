import type { MetadataRoute } from "next";
import { ideas, transIntelligence } from "@/data/ideas";
import { people } from "@/data/people";
import { publicVentures } from "@/data/ventures";
import { writingPosts } from "@/lib/writing";
import { listPublishedNodesByType } from "@/lib/kg-store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [questions, predictions] = await Promise.all([
    listPublishedNodesByType("question"),
    listPublishedNodesByType("prediction")
  ]);

  const routes = [
    "",
    "/about",
    "/evidence",
    "/ideas",
    "/map",
    "/research",
    "/research/computational-superstition",
    "/questions",
    "/predictions",
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
    ...writingPosts.map((post) => `/writing/${post.slug}`),
    ...questions.map((question) => `/questions/${question.slug}`),
    ...predictions.map((prediction) => `/predictions/${prediction.slug}`)
  ];

  return routes.map((route) => ({
    url: `https://thinkjackson.com${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8
  }));
}
