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
  try {
    const body = await req.json();
    const { slug, collection } = body as { slug: string; collection: string };

    if (!slug || !collection) {
      return NextResponse.json(
        { error: "slug and collection are required" },
        { status: 400 }
      );
    }

    const dir = COLLECTION_DIRS[collection];
    if (!dir) {
      return NextResponse.json({ error: "Invalid collection" }, { status: 400 });
    }

    const filePath = path.join(dir, `${slug}.mdx`);
    const fullPath = path.join(/*turbopackIgnore: true*/ process.cwd(), filePath);

    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    fs.unlinkSync(fullPath);

    execSync(`git add ${filePath}`, { cwd: /*turbopackIgnore: true*/ process.cwd() });
    execSync(`git commit -m "content: delete ${slug}"`, { cwd: /*turbopackIgnore: true*/ process.cwd() });
    execSync("git push origin main", { cwd: /*turbopackIgnore: true*/ process.cwd() });

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/composer/delete]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
