import { streamText } from "ai";
import { NextRequest } from "next/server";

// Gateway model IDs: "provider/model" — routed through Vercel AI Gateway
// using AI_GATEWAY_API_KEY automatically
const GATEWAY_MODELS: Record<string, string> = {
  "gpt-5": "openai/gpt-5",
  "gpt-4o": "openai/gpt-4o",
  "claude-opus-4-6": "anthropic/claude-opus-4-6",
  "claude-sonnet-4-6": "anthropic/claude-sonnet-4-6",
};

const LANGUAGE_LABELS: Record<string, string> = {
  en: "English",
  vi: "Vietnamese (Tiếng Việt)",
};

const SYSTEM_PROMPT = `You are an expert content writer for the Unimind platform.
Generate well-structured MDX content with proper frontmatter.

Rules:
- Always return valid MDX with YAML frontmatter at the top
- Use proper markdown formatting
- Keep tone professional but approachable
- Include relevant headings, lists, and callouts where appropriate
- For blog posts: include title, date (today's date), author (placeholder), tags, locale, status: draft
- For wiki articles: include title, date, author, category, locale, status: draft
- For handbook entries: include title, date, author, section, order: 1, locale, status: draft
- For landing pages: include title, description, locale, status: draft
- The "locale" frontmatter field must be exactly: "en" for English or "vi" for Vietnamese
- Return ONLY the raw MDX content — no code fences, no explanations, just the MDX`;

function getPromptForType(
  contentType: string,
  userPrompt: string,
  language: string
): string {
  const typeLabel =
    (
      {
        blog: "blog post",
        wiki: "wiki article",
        handbook: "handbook entry",
        landing: "landing page",
      } as Record<string, string>
    )[contentType] ?? "content";

  const langLabel = LANGUAGE_LABELS[language] ?? "English";

  return `Write a ${typeLabel} in ${langLabel} about: ${userPrompt}

The entire content (title, headings, body) must be written in ${langLabel}.
Return valid MDX with frontmatter. Return ONLY the MDX content, no code blocks or extra text.`;
}

export async function POST(req: NextRequest) {
  if (!process.env.AI_GATEWAY_API_KEY) {
    return new Response(
      JSON.stringify({ error: "AI_GATEWAY_API_KEY is not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
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

  const gatewayModel = GATEWAY_MODELS[model] ?? "openai/gpt-5";

  const result = streamText({
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

  return result.toTextStreamResponse();
}
