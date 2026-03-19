import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { NextRequest } from "next/server";

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
  const typeLabel =
    ({
      blog: "blog post",
      wiki: "wiki article",
      handbook: "handbook entry",
      landing: "landing page",
    } as Record<string, string>)[contentType] ?? "content";

  return `Write a ${typeLabel} about: ${userPrompt}

Return valid MDX with frontmatter. Return ONLY the MDX content, no code blocks or extra text.`;
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY is not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let contentType: string;
  let prompt: string;

  try {
    const body = await req.json();
    contentType = body.contentType ?? "blog";
    prompt = body.prompt;
    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return new Response(JSON.stringify({ error: "prompt is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const result = streamText({
    model: anthropic("claude-opus-4-6"),
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: getPromptForType(contentType, prompt.trim()),
      },
    ],
    maxOutputTokens: 4096,
  });

  return result.toTextStreamResponse();
}
