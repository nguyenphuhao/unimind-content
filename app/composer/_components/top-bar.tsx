"use client";

type ContentType = "posts" | "wiki" | "handbook" | "pages";
type Language = "en" | "vi";

interface TopBarProps {
  contentType: ContentType;
  language: Language;
  showPreview: boolean;
  publishing: boolean;
  onContentTypeChange: (type: ContentType) => void;
  onLanguageChange: (lang: Language) => void;
  onTogglePreview: () => void;
  onPublish: () => void;
  onBack: () => void;
}

const CONTENT_TYPES: { value: ContentType; label: string }[] = [
  { value: "posts", label: "Blog Post" },
  { value: "wiki", label: "Wiki Article" },
  { value: "handbook", label: "Handbook Entry" },
  { value: "pages", label: "Landing Page" },
];

const LANGUAGES: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "vi", label: "Tiếng Việt" },
];

export function TopBar({
  contentType,
  language,
  showPreview,
  publishing,
  onContentTypeChange,
  onLanguageChange,
  onTogglePreview,
  onPublish,
  onBack,
}: TopBarProps) {
  const selectStyle = {
    background: "hsl(var(--input, var(--muted)))",
    borderColor: "hsl(var(--border))",
    color: "hsl(var(--foreground))",
  };

  return (
    <div
      className="flex items-center justify-between px-4 py-2 border-b shrink-0"
      style={{
        background: "hsl(var(--card))",
        borderColor: "hsl(var(--border))",
      }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="text-sm px-2 py-1 rounded hover:opacity-70"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          ← Back
        </button>
        <span
          className="font-bold text-lg"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Composer
        </span>
        <select
          value={contentType}
          onChange={(e) => onContentTypeChange(e.target.value as ContentType)}
          className="rounded border px-2 py-1 text-sm"
          style={selectStyle}
        >
          {CONTENT_TYPES.map((ct) => (
            <option key={ct.value} value={ct.value}>
              {ct.label}
            </option>
          ))}
        </select>
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value as Language)}
          className="rounded border px-2 py-1 text-sm"
          style={selectStyle}
        >
          {LANGUAGES.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onTogglePreview}
          className="px-3 py-1.5 rounded text-sm font-medium border"
          style={{
            background: showPreview ? "hsl(var(--muted))" : "transparent",
            borderColor: "hsl(var(--border))",
            color: "hsl(var(--foreground))",
          }}
        >
          Preview
        </button>
        <button
          onClick={onPublish}
          disabled={publishing}
          className="px-4 py-1.5 rounded text-sm font-medium disabled:opacity-50"
          style={{
            background: "hsl(var(--primary))",
            color: "white",
          }}
        >
          {publishing ? "Publishing..." : "Publish"}
        </button>
      </div>
    </div>
  );
}
