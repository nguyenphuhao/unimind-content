import { streamText } from "ai";
import { NextRequest } from "next/server";
import {
  GATEWAY_MODELS,
  SYSTEM_PROMPT,
  getPromptForType,
} from "@/lib/ai";

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
