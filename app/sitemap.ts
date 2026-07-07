import type { MetadataRoute } from "next";
import { projects } from "@/data/site";
import { writingPosts } from "@/lib/writing";

const routes = [
  "",
  "/about",
  "/research",
  "/research/computational-superstition",
  "/projects",
  "/writing",
  "/now",
  "/consulting",
  "/contact",
  ...projects.map((project) => `/projects/${project.slug}`),
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
