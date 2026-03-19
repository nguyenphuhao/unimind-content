import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "@/keystatic.config";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export const reader = createReader(process.cwd(), keystaticConfig);

const isDev = process.env.VERCEL_ENV !== "production";

// Read raw MDX body from a content file (after stripping frontmatter)
function readMdxBody(filePath: string): string {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { content } = matter(raw);
  return content;
}

// ---- Posts ----

export async function getPosts() {
  const posts = await reader.collections.posts.all();
  return isDev ? posts : posts.filter((p) => p.entry.status === "published");
}

export async function getPost(slug: string) {
  const entry = await reader.collections.posts.read(slug);
  if (!entry) return null;
  const filePath = path.join(process.cwd(), "content/posts", `${slug}.mdx`);
  const body = readMdxBody(filePath);
  return { ...entry, body };
}

// ---- Wiki ----

export async function getWikiArticles() {
  const articles = await reader.collections.wiki.all();
  return isDev
    ? articles
    : articles.filter((a) => a.entry.status === "published");
}

export async function getWikiArticle(slug: string) {
  const entry = await reader.collections.wiki.read(slug);
  if (!entry) return null;
  const filePath = path.join(process.cwd(), "content/wiki", `${slug}.mdx`);
  const body = readMdxBody(filePath);
  return { ...entry, body };
}

// ---- Handbook ----

export async function getHandbookEntries() {
  const entries = await reader.collections.handbook.all();
  const visible = isDev
    ? entries
    : entries.filter((e) => e.entry.status === "published");
  return visible.sort((a, b) => (a.entry.order ?? 0) - (b.entry.order ?? 0));
}

export async function getHandbookEntry(slug: string) {
  const entry = await reader.collections.handbook.read(slug);
  if (!entry) return null;
  const filePath = path.join(process.cwd(), "content/handbook", `${slug}.mdx`);
  const body = readMdxBody(filePath);
  return { ...entry, body };
}

// ---- Pages ----

export async function getPages() {
  const pages = await reader.collections.pages.all();
  return isDev ? pages : pages.filter((p) => p.entry.status === "published");
}

export async function getPage(slug: string) {
  const entry = await reader.collections.pages.read(slug);
  if (!entry) return null;
  const filePath = path.join(process.cwd(), "content/pages", `${slug}.mdx`);
  const body = readMdxBody(filePath);
  return { ...entry, body };
}
