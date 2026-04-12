import { draftMode } from "next/headers";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const isDev = process.env.VERCEL_ENV !== "production";

async function showDrafts(): Promise<boolean> {
  if (isDev) return true;
  try {
    const dm = await draftMode();
    return dm.isEnabled;
  } catch {
    return false;
  }
}

function contentDir(collection: string): string {
  return path.join(/*turbopackIgnore: true*/ process.cwd(), "content", collection);
}

interface RawEntry {
  slug: string;
  entry: ContentEntry;
}

function readAllMdx(collection: string): RawEntry[] {
  const dir = contentDir(collection);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data, content } = matter(raw);
      return { slug, entry: { ...data, body: content } as ContentEntry };
    });
}

export interface ContentEntry {
  body: string;
  title: string;
  locale: string;
  status: string;
  date: string;
  author: string;
  tags: string[];
  category: string;
  section: string;
  order: number;
  description: string;
  coverImage: string | null;
  [key: string]: unknown;
}

function readOneMdx(collection: string, slug: string): ContentEntry | null {
  const filePath = path.join(contentDir(collection), `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { ...data, body: content } as ContentEntry;
}

// ---- Posts ----

export async function getPosts(locale: string = "en") {
  const all = readAllMdx("posts");
  const drafts = await showDrafts();
  const visible = drafts ? all : all.filter((p) => p.entry.status === "published");
  return visible
    .filter((p) => (p.entry.locale ?? "en") === locale)
    .map((p): ContentEntry & { slug: string } => ({ slug: p.slug, ...p.entry }));
}

export async function getPost(slug: string) {
  return readOneMdx("posts", slug);
}

// ---- Wiki ----

export async function getWikiArticles(locale: string = "en") {
  const all = readAllMdx("wiki");
  const drafts = await showDrafts();
  const visible = drafts ? all : all.filter((a) => a.entry.status === "published");
  return visible
    .filter((a) => (a.entry.locale ?? "en") === locale)
    .map((a): ContentEntry & { slug: string } => ({ slug: a.slug, ...a.entry }));
}

export async function getWikiArticle(slug: string) {
  return readOneMdx("wiki", slug);
}

// ---- Handbook ----

export async function getHandbookEntries(locale: string = "en") {
  const all = readAllMdx("handbook");
  const drafts = await showDrafts();
  const visible = drafts ? all : all.filter((e) => e.entry.status === "published");
  return visible
    .filter((e) => (e.entry.locale ?? "en") === locale)
    .sort((a, b) => ((a.entry.order as number) ?? 0) - ((b.entry.order as number) ?? 0))
    .map((e): ContentEntry & { slug: string } => ({ slug: e.slug, ...e.entry }));
}

export async function getHandbookEntry(slug: string) {
  return readOneMdx("handbook", slug);
}

// ---- Pages ----

export async function getPages(locale: string = "en") {
  const all = readAllMdx("pages");
  const drafts = await showDrafts();
  const visible = drafts ? all : all.filter((p) => p.entry.status === "published");
  return visible
    .filter((p) => (p.entry.locale ?? "en") === locale)
    .map((p): ContentEntry & { slug: string } => ({ slug: p.slug, ...p.entry }));
}

export async function getPage(slug: string) {
  return readOneMdx("pages", slug);
}
