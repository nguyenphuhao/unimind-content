import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const COLLECTIONS = ["posts", "wiki", "handbook", "pages"] as const;
type Collection = (typeof COLLECTIONS)[number];

const COLLECTION_DIRS: Record<Collection, string> = {
  posts: "content/posts",
  wiki: "content/wiki",
  handbook: "content/handbook",
  pages: "content/pages",
};

const COLLECTION_LABELS: Record<Collection, string> = {
  posts: "Blog",
  wiki: "Wiki",
  handbook: "Handbook",
  pages: "Page",
};

interface ContentListItem {
  slug: string;
  collection: Collection;
  collectionLabel: string;
  title: string;
  locale: string;
  status: string;
  date: string;
}

function listAllContent(): ContentListItem[] {
  const items: ContentListItem[] = [];

  for (const collection of COLLECTIONS) {
    const dir = path.join(process.cwd(), COLLECTION_DIRS[collection]);
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
    for (const file of files) {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data } = matter(raw);

      items.push({
        slug,
        collection,
        collectionLabel: COLLECTION_LABELS[collection],
        title: typeof data.title === "string" ? data.title : slug,
        locale: typeof data.locale === "string" ? data.locale : "en",
        status: typeof data.status === "string" ? data.status : "draft",
        date: typeof data.date === "string" ? data.date : "",
      });
    }
  }

  return items.sort((a, b) => b.date.localeCompare(a.date));
}

function readContent(slug: string, collection: Collection) {
  const dir = COLLECTION_DIRS[collection];
  if (!dir) return null;

  const filePath = path.join(process.cwd(), dir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    collection,
    frontmatter: data,
    body: content,
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const slug = searchParams.get("slug");
  const collection = searchParams.get("collection") as Collection | null;

  if (slug && collection) {
    if (!COLLECTIONS.includes(collection)) {
      return NextResponse.json({ error: "Invalid collection" }, { status: 400 });
    }
    const content = readContent(slug, collection);
    if (!content) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(content);
  }

  const items = listAllContent();
  return NextResponse.json(items);
}
