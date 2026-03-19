import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";
import matter from "gray-matter";
import {
  GATEWAY_MODELS,
  SYSTEM_PROMPT,
  getPromptForType,
  KEYSTATIC_COLLECTION,
  CONTENT_DIR,
  slugify,
} from "@/lib/ai";

const GITHUB_OWNER = "nguyenphuhao";
const GITHUB_REPO = "unimind-content";
const GITHUB_BRANCH = "main";

async function commitFileToGitHub(
  filePath: string,
  content: string
): Promise<void> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN is not configured");

  const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`;
  const encoded = Buffer.from(content, "utf-8").toString("base64");

  // Check if file already exists (to get its SHA for update)
  let sha: string | undefined;
  const getRes = await fetch(`${apiUrl}?ref=${GITHUB_BRANCH}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
  });
  if (getRes.ok) {
    const existing = await getRes.json() as { sha: string };
    sha = existing.sha;
  }

  const body: Record<string, string> = {
    message: `content: AI-generated ${filePath}`,
    content: encoded,
    branch: GITHUB_BRANCH,
  };
  if (sha) body.sha = sha;

  const putRes = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!putRes.ok) {
    const err = await putRes.json().catch(() => ({})) as { message?: string };
    throw new Error(`GitHub API error: ${err.message ?? putRes.status}`);
  }
}

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

  try {
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

    const dir = CONTENT_DIR[contentType] ?? "content/posts";

    // Ensure unique slug — try up to 10 variants
    let finalSlug = slug;
    let counter = 1;
    while (counter <= 10) {
      const checkPath = `${dir}/${finalSlug}.mdx`;
      const checkRes = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${checkPath}?ref=${GITHUB_BRANCH}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN ?? ""}`,
            Accept: "application/vnd.github+json",
          },
        }
      );
      if (checkRes.status === 404) break; // file doesn't exist — good to use
      finalSlug = `${slug}-${counter++}`;
    }

    const filePath = `${dir}/${finalSlug}.mdx`;
    await commitFileToGitHub(filePath, text);

    const collection = KEYSTATIC_COLLECTION[contentType] ?? "posts";

    return NextResponse.json({
      slug: finalSlug,
      collection,
      editorUrl: `/adminx/collection/${collection}/item/${finalSlug}`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/ai/create]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
