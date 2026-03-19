import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import {
  GATEWAY_MODELS,
  SYSTEM_PROMPT,
  getPromptForType,
  KEYSTATIC_COLLECTION,
  CONTENT_DIR,
  slugify,
} from "@/lib/ai";

export async function POST(req: NextRequest) {
  if (!process.env.AI_GATEWAY_API_KEY) {
    return NextResponse.json(
      { error: "AI_GATEWAY_API_KEY is not configured" },
      { status: 500 }
    );
  }

  let contentType: string;
  let prompt: string;
  let model: string;
  let language: string;

  try {
    const body = await req.json();
    contentType = body.contentType ?? "blog";
    prompt = body.prompt;
    model = body.model ?? "gpt-5";
    language = body.language ?? "en";

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json({ error: "prompt is required" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const gatewayModel = GATEWAY_MODELS[model] ?? "openai/gpt-5";

  // Generate full MDX (non-streaming so we can write the file)
  const { text } = await generateText({
    model: gatewayModel,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: getPromptForType(contentType, prompt.trim(), language),
      },
    ],
    maxOutputTokens: 4096,
  });

  // Extract title from frontmatter to build the slug
  let slug: string;
  try {
    const { data } = matter(text);
    const title = typeof data.title === "string" ? data.title : prompt;
    slug = slugify(title) || slugify(prompt) || "untitled";
  } catch {
    slug = slugify(prompt) || "untitled";
  }

  // Ensure unique slug — append a counter if the file already exists
  const dir = path.join(process.cwd(), CONTENT_DIR[contentType] ?? "content/posts");
  let finalSlug = slug;
  let counter = 1;
  while (true) {
    try {
      await fs.access(path.join(dir, `${finalSlug}.mdx`));
      finalSlug = `${slug}-${counter++}`;
    } catch {
      break; // file doesn't exist — good to use
    }
  }

  // Write the MDX file
  await fs.writeFile(path.join(dir, `${finalSlug}.mdx`), text, "utf-8");

  const collection = KEYSTATIC_COLLECTION[contentType] ?? "posts";

  return NextResponse.json({
    slug: finalSlug,
    collection,
    editorUrl: `/keystatic/collection/${collection}/item/${finalSlug}`,
  });
}
