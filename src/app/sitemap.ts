import { MetadataRoute } from "next";
import { getPublishedResources } from "@/lib/data/resources";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jakdev-orcin.vercel.app";
  const resources = await getPublishedResources();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/library`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/favorites`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];

  const resourceRoutes: MetadataRoute.Sitemap = resources.map((r) => ({
    url: `${baseUrl}/resource/${r.slug}`,
    lastModified: new Date(r.updatedAt || r.createdAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...resourceRoutes];
}
