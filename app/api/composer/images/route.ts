import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const VALID_COLLECTIONS = ["posts", "wiki", "handbook", "pages"];

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const collection = formData.get("collection") as string | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!collection || !VALID_COLLECTIONS.includes(collection)) {
    return NextResponse.json({ error: "Invalid collection" }, { status: 400 });
  }

  const timestamp = Date.now();
  const safeName = file.name
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-");
  const filename = `${timestamp}-${safeName}`;

  const dir = path.join(/*turbopackIgnore: true*/ process.cwd(), "public", "images", collection);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(dir, filename), buffer);

  const publicPath = `/images/${collection}/${filename}`;
  return NextResponse.json({ url: publicPath });
}
