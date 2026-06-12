import type { MetadataRoute } from "next";
import { company } from "@/lib/data/company";
import { projects } from "@/lib/data/projects";
import { news } from "@/lib/data/news";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { path: "", priority: 1.0 },
    { path: "/about", priority: 0.9 },
    { path: "/services", priority: 0.9 },
    { path: "/projects", priority: 0.9 },
    { path: "/hse", priority: 0.8 },
    { path: "/careers", priority: 0.7 },
    { path: "/news", priority: 0.7 },
    { path: "/contact", priority: 0.8 },
  ].map((p) => ({
    url: `${company.url}${p.path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: p.priority,
  }));

  const projectPages = projects.map((p) => ({
    url: `${company.url}/projects/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const newsPages = news.map((n) => ({
    url: `${company.url}/news/${n.slug}`,
    lastModified: new Date(n.date),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...projectPages, ...newsPages];
}
