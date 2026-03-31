import type { MetadataRoute } from "next";

const BASE_URL = process.env.SITE_URL || "https://unimind.vn";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/keystatic", "/adminx", "/api/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
