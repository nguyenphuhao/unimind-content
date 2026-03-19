"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ContentType = "blog" | "wiki" | "handbook" | "landing";
type Language = "en" | "vi";
type AIModel =
  | "gpt-5"
  | "gpt-4o"
  | "claude-opus-4-6"
  | "claude-sonnet-4-6";

const CONTENT_TYPES: { value: ContentType; label: string }[] = [
  { value: "blog", label: "Blog Post" },
  { value: "wiki", label: "Wiki Article" },
  { value: "handbook", label: "Handbook Entry" },
  { value: "landing", label: "Landing Page" },
];

const AI_MODELS: { value: AIModel; label: string; provider: string }[] = [
  { value: "gpt-5", label: "ChatGPT 5", provider: "OpenAI" },
  { value: "gpt-4o", label: "GPT-4o", provider: "OpenAI" },
  { value: "claude-opus-4-6", label: "Claude Opus 4.6", provider: "Anthropic" },
  { value: "claude-sonnet-4-6", label: "Claude Sonnet 4.6", provider: "Anthropic" },
];

const LANGUAGES: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "vi", label: "Tiếng Việt" },
];

export default function AiWriterPage() {
  const router = useRouter();
  const [contentType, setContentType] = useState<ContentType>("blog");
  const [model, setModel] = useState<AIModel>("gpt-5");
  const [language, setLanguage] = useState<Language>("en");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [mdxOutput, setMdxOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");
    setMdxOutput("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType, prompt, model, language }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          (data as { error?: string }).error ?? `HTTP ${res.status}`
        );
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No response stream");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setMdxOutput((prev) => prev + decoder.decode(value, { stream: true }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateInEditor() {
    if (!prompt.trim()) return;
    setCreating(true);
    setError("");

    try {
      const res = await fetch("/api/ai/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType, prompt, model, language }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          (data as { error?: string }).error ?? `HTTP ${res.status}`
        );
      }

      const { editorUrl } = await res.json() as { editorUrl: string };
      router.push(editorUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setCreating(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(mdxOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const selectStyle = {
    background: "hsl(var(--input))",
    borderColor: "hsl(var(--border))",
    color: "hsl(var(--foreground))",
  };

  return (
    <main
      className="min-h-screen px-6 py-12"
      style={{ background: "hsl(var(--background))" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: "hsl(var(--foreground))" }}
          >
            AI Content Writer
          </h1>
          <p style={{ color: "hsl(var(--muted-foreground))" }}>
            Generate structured MDX content with AI — preview it here or open
            directly in the Keystatic editor.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div
            className="rounded-xl border p-6 space-y-5"
            style={{ background: "hsl(var(--card))" }}
          >
            {/* Row 1: Model + Language */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="model"
                >
                  AI Model
                </label>
                <select
                  id="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value as AIModel)}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  style={selectStyle}
                >
                  {AI_MODELS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label} ({m.provider})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="language"
                >
                  Language
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  style={selectStyle}
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Content Type */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                htmlFor="contentType"
              >
                Content Type
              </label>
              <select
                id="contentType"
                value={contentType}
                onChange={(e) => setContentType(e.target.value as ContentType)}
                className="w-full rounded-lg border px-3 py-2 text-sm"
                style={selectStyle}
              >
                {CONTENT_TYPES.map((ct) => (
                  <option key={ct.value} value={ct.value}>
                    {ct.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Prompt */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                htmlFor="prompt"
              >
                Topic / Prompt
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                placeholder="Describe what you want to write about..."
                className="w-full rounded-lg border px-3 py-2 text-sm resize-none"
                style={selectStyle}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 flex-wrap">
              <button
                type="submit"
                disabled={loading || creating || !prompt.trim()}
                className="px-5 py-2 rounded-lg font-medium text-sm transition-opacity disabled:opacity-50"
                style={{
                  background: "hsl(var(--muted))",
                  color: "hsl(var(--foreground))",
                  border: "1px solid hsl(var(--border))",
                }}
              >
                {loading ? "Generating…" : "Preview MDX"}
              </button>

              <button
                type="button"
                onClick={handleCreateInEditor}
                disabled={loading || creating || !prompt.trim()}
                className="px-5 py-2 rounded-lg font-medium text-sm transition-opacity disabled:opacity-50"
                style={{
                  background: "hsl(var(--primary))",
                  color: "hsl(var(--primary-foreground))",
                }}
              >
                {creating ? "Creating…" : "✨ Generate & Open in Editor"}
              </button>
            </div>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div
            className="mb-4 rounded-lg border p-4 text-sm"
            style={{
              borderColor: "hsl(var(--destructive))",
              background: "hsl(var(--destructive) / 0.1)",
              color: "hsl(var(--destructive))",
            }}
          >
            {error}
          </div>
        )}

        {/* Output preview */}
        {mdxOutput && (
          <div
            className="rounded-xl border overflow-hidden"
            style={{ background: "hsl(var(--card))" }}
          >
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ background: "hsl(var(--muted))" }}
            >
              <span className="text-sm font-medium">
                Generated MDX
                {loading && (
                  <span
                    className="ml-2 text-xs"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    streaming…
                  </span>
                )}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  disabled={loading}
                  className="text-sm px-3 py-1 rounded-md border transition-colors disabled:opacity-50"
                  style={{
                    borderColor: "hsl(var(--border))",
                    color: "hsl(var(--foreground))",
                  }}
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
                <a
                  href="/keystatic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm px-3 py-1 rounded-md transition-opacity"
                  style={{
                    background: "hsl(var(--primary))",
                    color: "hsl(var(--primary-foreground))",
                  }}
                >
                  Open Keystatic →
                </a>
              </div>
            </div>
            <pre
              className="p-4 text-sm overflow-x-auto overflow-y-auto whitespace-pre-wrap max-h-[600px]"
              style={{ color: "hsl(var(--foreground))" }}
            >
              {mdxOutput}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
