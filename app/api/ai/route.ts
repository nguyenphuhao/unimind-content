import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert content writer for the Unimind platform.
Generate well-structured MDX content with proper frontmatter.

Rules:
- Always return valid MDX with YAML frontmatter at the top
- Use proper markdown formatting
- Keep tone professional but approachable
- Include relevant headings, lists, and callouts where appropriate
- For blog posts: include title, date (today's date), author (placeholder), tags, status: draft
- For wiki articles: include title, date, author, category, status: draft
- For handbook entries: include title, date, author, section, order: 1, status: draft
- For landing pages: include title, description, status: draft
- Return ONLY the raw MDX content — no code fences, no explanations, just the MDX`;

function getPromptForType(contentType: string, userPrompt: string): string {
  const typeLabel = {
    blog: "blog post",
    wiki: "wiki article",
    handbook: "handbook entry",
    landing: "landing page",
  }[contentType] ?? "content";

  return `Write a ${typeLabel} about: ${userPrompt}

Return valid MDX with frontmatter. Return ONLY the MDX content, no code blocks or extra text.`;
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured" },
      { status: 500 }
    );
  }

  let contentType: string;
  let prompt: string;

  try {
    const body = await req.json();
    contentType = body.contentType ?? "blog";
    prompt = body.prompt;
    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json(
        { error: "prompt is required" },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: getPromptForType(contentType, prompt.trim()),
        },
      ],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json(
        { error: "No content returned from AI" },
        { status: 500 }
      );
    }

    return NextResponse.json({ mdx: textBlock.text });
  } catch (err) {
    console.error("[/api/ai] error:", err);
    const message =
      err instanceof Error ? err.message : "AI generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
