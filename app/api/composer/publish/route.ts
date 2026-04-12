import { NextRequest, NextResponse } from "next/server";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const COLLECTION_DIRS: Record<string, string> = {
  posts: "content/posts",
  wiki: "content/wiki",
  handbook: "content/handbook",
  pages: "content/pages",
};

export async function POST(req: NextRequest) {
  let slug: string;
  let collection: string;
  let content: string;
  let title: string;

  try {
    const body = await req.json();
    slug = body.slug;
    collection = body.collection;
    content = body.content;
    title = body.title || slug;

    if (!slug || !collection || !content) {
      return NextResponse.json(
        { error: "slug, collection, and content are required" },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const dir = COLLECTION_DIRS[collection];
  if (!dir) {
    return NextResponse.json({ error: "Invalid collection" }, { status: 400 });
  }

  const filePath = path.join(dir, `${slug}.mdx`);
  const fullPath = path.join(process.cwd(), filePath);

  try {
    const dirPath = path.dirname(fullPath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFileSync(fullPath, content, "utf-8");

    const imageDir = `public/images/${collection}`;
    const gitAddPaths = [filePath];
    if (fs.existsSync(path.join(process.cwd(), imageDir))) {
      gitAddPaths.push(imageDir);
    }

    execSync(`git add ${gitAddPaths.join(" ")}`, { cwd: process.cwd() });
    execSync(
      `git commit -m "content: ${title}"`,
      { cwd: process.cwd() }
    );
    execSync("git push origin main", { cwd: process.cwd() });

    return NextResponse.json({ success: true, path: filePath });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/composer/publish]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
