"use client";

import { useEffect, useRef, useState } from "react";

interface PreviewPanelProps {
  markdown: string;
}

export function PreviewPanel({ markdown }: PreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch("/composer/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ markdown }),
        });
        const html = await res.text();

        if (iframeRef.current) {
          iframeRef.current.srcdoc = html;
        }
      } catch {
        if (iframeRef.current) {
          iframeRef.current.srcdoc =
            '<body style="font-family:monospace;color:#dc2626;padding:2rem;">Preview failed to load</body>';
        }
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
      <iframe
        ref={iframeRef}
        className="flex-1 w-full"
        style={{ border: "none", background: "white" }}
        title="Content Preview"
        sandbox="allow-same-origin"
      />
    </div>
  );
}
