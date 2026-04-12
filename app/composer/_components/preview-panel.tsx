"use client";

interface PreviewPanelProps {
  previewUrl: string;
}

export function PreviewPanel({ previewUrl }: PreviewPanelProps) {
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
      </div>
      <iframe
        src={previewUrl}
        className="flex-1 w-full"
        style={{ border: "none", background: "white" }}
        title="Content Preview"
      />
    </div>
  );
}
