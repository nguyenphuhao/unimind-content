"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";

interface PreviewPanelProps {
  markdown: string;
}

function Callout({
  children,
  type = "info",
}: {
  children: ReactNode;
  type?: string;
}) {
  const colors: Record<string, { border: string; bg: string }> = {
    info: { border: "hsl(217 91% 60%)", bg: "hsl(217 91% 60% / 0.1)" },
    warning: { border: "hsl(38 92% 50%)", bg: "hsl(38 92% 50% / 0.1)" },
    error: { border: "hsl(0 84% 60%)", bg: "hsl(0 84% 60% / 0.1)" },
    success: { border: "hsl(160 84% 39%)", bg: "hsl(160 84% 39% / 0.1)" },
  };
  const c = colors[type] || colors.info;
  return (
    <div
      style={{
        border: `1px solid ${c.border}`,
        borderLeft: `4px solid ${c.border}`,
        background: c.bg,
        borderRadius: "0.5rem",
        padding: "1rem",
        margin: "1rem 0",
      }}
    >
      {children}
    </div>
  );
}

function Card({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div
      style={{
        border: "1px solid hsl(214 32% 91%)",
        borderRadius: "0.5rem",
        padding: "1.25rem",
        margin: "1rem 0",
        background: "white",
      }}
    >
      {title && (
        <h3 style={{ fontWeight: 600, marginBottom: "0.5rem" }}>{title}</h3>
      )}
      {children}
    </div>
  );
}

const previewComponents = { Callout, Card };

export function PreviewPanel({ markdown }: PreviewPanelProps) {
  const [content, setContent] = useState<ReactNode>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      if (!markdown.trim()) {
        setContent(null);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const { default: MDXContent } = await evaluate(markdown, {
          ...runtime,
          baseUrl: window.location.origin,
        });
        setContent(<MDXContent components={previewComponents} />);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "MDX compilation error"
        );
        setContent(null);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [markdown]);

  return (
    <div
      className="flex-1 flex flex-col border-l overflow-hidden"
      style={{ borderColor: "hsl(var(--border))" }}
    >
      {loading && (
        <div
          className="text-xs px-3 py-1 shrink-0"
          style={{
            color: "hsl(var(--muted-foreground))",
            background: "hsl(var(--muted))",
          }}
        >
          Rendering...
        </div>
      )}
      <div
        className="flex-1 overflow-auto p-6"
        style={{
          fontFamily: "'Nunito', sans-serif",
          color: "hsl(var(--foreground))",
          lineHeight: 1.7,
        }}
      >
        {error ? (
          <div
            style={{
              fontFamily: "monospace",
              color: "hsl(0 84% 60%)",
              fontSize: "0.875rem",
            }}
          >
            <h3>Preview Error</h3>
            <pre style={{ whiteSpace: "pre-wrap" }}>{error}</pre>
          </div>
        ) : (
          <article className="prose prose-sm max-w-none">{content}</article>
        )}
      </div>
    </div>
  );
}
