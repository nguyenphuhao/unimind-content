"use client";

import { useEffect, useRef, useState } from "react";

interface PreviewPanelProps {
  previewUrl: string;
  refreshKey: number;
}

export function PreviewPanel({ previewUrl, refreshKey }: PreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (iframeRef.current) {
      setLoading(true);
      iframeRef.current.src = previewUrl;
    }
  }, [previewUrl, refreshKey]);

  return (
    <div
      className="flex-1 flex flex-col border-l overflow-hidden"
      style={{ borderColor: "hsl(var(--border))" }}
    >
      <div
        className="text-xs font-medium uppercase tracking-wider px-4 py-1.5 border-b shrink-0 flex items-center justify-between"
        style={{
          color: "hsl(var(--muted-foreground))",
          background: "hsl(var(--muted))",
          borderColor: "hsl(var(--border))",
        }}
      >
        <span>Preview</span>
        {loading && <span className="opacity-60">Loading...</span>}
      </div>
      <iframe
        ref={iframeRef}
        src={previewUrl}
        className="flex-1 w-full"
        style={{ border: "none", background: "white" }}
        title="Content Preview"
        onLoad={() => setLoading(false)}
      />
    </div>
  );
}
