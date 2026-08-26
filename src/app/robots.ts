import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jakdev-orcin.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/library", "/resource/", "/favorites"],
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
