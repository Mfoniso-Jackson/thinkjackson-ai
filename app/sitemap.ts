import type { MetadataRoute } from "next";

const routes = ["", "/about", "/research", "/projects", "/writing", "/consulting", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `https://thinkjackson.ai${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8
  }));
}
