"use client";

import { useState } from "react";

type ContentType = "blog" | "wiki" | "handbook" | "landing";

const CONTENT_TYPES: { value: ContentType; label: string }[] = [
  { value: "blog", label: "Blog Post" },
  { value: "wiki", label: "Wiki Article" },
  { value: "handbook", label: "Handbook Entry" },
  { value: "landing", label: "Landing Page" },
];

export default function AiWriterPage() {
  const [contentType, setContentType] = useState<ContentType>("blog");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
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
        body: JSON.stringify({ contentType, prompt }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          (data as { error?: string }).error ?? `HTTP ${res.status}`
        );
      }

      // Stream the text response
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

  async function handleCopy() {
    await navigator.clipboard.writeText(mdxOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

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
            Generate structured MDX content with Claude. Copy the output to
            paste into Keystatic.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div
            className="rounded-xl border p-6 space-y-5"
            style={{ background: "hsl(var(--card))" }}
          >
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
                onChange={(e) =>
                  setContentType(e.target.value as ContentType)
                }
                className="w-full rounded-lg border px-3 py-2 text-sm"
                style={{
                  background: "hsl(var(--input))",
                  borderColor: "hsl(var(--border))",
                  color: "hsl(var(--foreground))",
                }}
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
                style={{
                  background: "hsl(var(--input))",
                  borderColor: "hsl(var(--border))",
                  color: "hsl(var(--foreground))",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="px-5 py-2 rounded-lg font-medium text-sm transition-opacity disabled:opacity-50"
              style={{
                background: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))",
              }}
            >
              {loading ? "Generating…" : "Generate MDX"}
            </button>
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

        {/* Output */}
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
              className="p-4 text-sm overflow-x-auto whitespace-pre-wrap"
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
