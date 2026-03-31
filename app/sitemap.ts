import type { MetadataRoute } from "next";
import { getPosts, getWikiArticles, getHandbookEntries, getPages } from "@/lib/content";

const BASE_URL = process.env.SITE_URL || "https://unimind.vn";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, wiki, handbook, pages] = await Promise.all([
    getPosts(),
    getWikiArticles(),
    getHandbookEntries(),
    getPages(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/blog`, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/wiki`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/handbook`, changeFrequency: "weekly", priority: 0.7 },
  ];

  const postPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: p.entry.date ? new Date(p.entry.date) : undefined,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const wikiPages: MetadataRoute.Sitemap = wiki.map((a) => ({
    url: `${BASE_URL}/wiki/${a.slug}`,
    lastModified: a.entry.date ? new Date(a.entry.date) : undefined,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const handbookPages: MetadataRoute.Sitemap = handbook.map((e) => ({
    url: `${BASE_URL}/handbook/${e.slug}`,
    lastModified: e.entry.date ? new Date(e.entry.date) : undefined,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const landingPages: MetadataRoute.Sitemap = pages.map((p) => ({
    url: `${BASE_URL}/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...postPages, ...wikiPages, ...handbookPages, ...landingPages];
}
