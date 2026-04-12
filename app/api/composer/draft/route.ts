import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const COLLECTION_DIRS: Record<string, string> = {
  posts: "content/posts",
  wiki: "content/wiki",
  handbook: "content/handbook",
  pages: "content/pages",
};

const COLLECTION_ROUTES: Record<string, string> = {
  posts: "blog",
  handbook: "handbook",
  pages: "",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, collection, content, language } = body as {
      slug: string;
      collection: string;
      content: string;
      language: string;
    };

    if (!slug || !collection || !content) {
      return NextResponse.json(
        { error: "slug, collection, and content are required" },
        { status: 400 }
      );
    }

    const dir = COLLECTION_DIRS[collection];
    if (!dir) {
      return NextResponse.json({ error: "Invalid collection" }, { status: 400 });
    }

    const fullDir = path.join(/*turbopackIgnore: true*/ process.cwd(), dir);
    if (!fs.existsSync(fullDir)) {
      fs.mkdirSync(fullDir, { recursive: true });
    }

    fs.writeFileSync(path.join(fullDir, `${slug}.mdx`), content, "utf-8");

    const lang = language || "en";
    const routeSegment = COLLECTION_ROUTES[collection];
    const previewUrl =
      routeSegment === ""
        ? `/${lang}/${slug}`
        : `/${lang}/${routeSegment}/${slug}`;

    return NextResponse.json({ previewUrl });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
