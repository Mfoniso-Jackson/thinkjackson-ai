import type { MetadataRoute } from "next";
import { projects, writing } from "@/data/site";

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
  "/launch",
  ...projects.map((project) => `/projects/${project.slug}`),
  ...writing.map((post) => `/writing/${post.slug}`)
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `https://thinkjackson.com${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8
  }));
}
