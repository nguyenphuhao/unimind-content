export const GATEWAY_MODELS: Record<string, string> = {
  "gpt-5": "openai/gpt-5",
  "gpt-4o": "openai/gpt-4o",
  "claude-opus-4-6": "anthropic/claude-opus-4-6",
  "claude-sonnet-4-6": "anthropic/claude-sonnet-4-6",
};

export const LANGUAGE_LABELS: Record<string, string> = {
  en: "English",
  vi: "Vietnamese (Tiếng Việt)",
};

export const SYSTEM_PROMPT = `You are an expert content writer for the Unimind platform.
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

export function getPromptForType(
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

/** Maps UI content type → Keystatic collection name */
export const KEYSTATIC_COLLECTION: Record<string, string> = {
  blog: "posts",
  wiki: "wiki",
  handbook: "handbook",
  landing: "pages",
};

/** Maps UI content type → content directory */
export const CONTENT_DIR: Record<string, string> = {
  blog: "content/posts",
  wiki: "content/wiki",
  handbook: "content/handbook",
  landing: "content/pages",
};

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 64);
}
