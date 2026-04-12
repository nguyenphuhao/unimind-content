"use client";

import { useState } from "react";

interface ContentItem {
  slug: string;
  collection: string;
  collectionLabel: string;
  title: string;
  locale: string;
  status: string;
  date: string;
}

interface ContentListProps {
  items: ContentItem[];
  loading: boolean;
  onSelect: (item: ContentItem) => void;
  onNew: () => void;
}

const statusColors: Record<string, { bg: string; text: string }> = {
  published: { bg: "hsl(160 84% 39% / 0.15)", text: "hsl(160 84% 39%)" },
  draft: { bg: "hsl(38 92% 50% / 0.15)", text: "hsl(38 75% 40%)" },
};

const collectionColors: Record<string, { bg: string; text: string }> = {
  Blog: { bg: "hsl(221 83% 53% / 0.12)", text: "hsl(221 83% 45%)" },
  Wiki: { bg: "hsl(270 60% 55% / 0.12)", text: "hsl(270 60% 45%)" },
  Handbook: { bg: "hsl(30 80% 50% / 0.12)", text: "hsl(30 80% 40%)" },
  Page: { bg: "hsl(180 50% 45% / 0.12)", text: "hsl(180 50% 35%)" },
};

const localeColors: Record<string, { bg: string; text: string }> = {
  en: { bg: "hsl(210 60% 50% / 0.12)", text: "hsl(210 60% 40%)" },
  vi: { bg: "hsl(0 70% 55% / 0.12)", text: "hsl(0 70% 42%)" },
};

type FilterType = "all" | "posts" | "wiki" | "handbook" | "pages";
type FilterLang = "all" | "en" | "vi";

const FILTER_TYPES: { value: FilterType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "posts", label: "Blog" },
  { value: "wiki", label: "Wiki" },
  { value: "handbook", label: "Handbook" },
  { value: "pages", label: "Pages" },
];

const FILTER_LANGS: { value: FilterLang; label: string }[] = [
  { value: "all", label: "All" },
  { value: "en", label: "EN" },
  { value: "vi", label: "VI" },
];

export function ContentList({ items, loading, onSelect, onNew }: ContentListProps) {
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [filterLang, setFilterLang] = useState<FilterLang>("all");

  const filtered = items.filter((item) => {
    if (filterType !== "all" && item.collection !== filterType) return false;
    if (filterLang !== "all" && item.locale !== filterLang) return false;
    return true;
  });

  return (
    <div
      className="min-h-screen px-6 py-12"
      style={{ background: "hsl(var(--background))" }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1
              className="text-3xl font-bold mb-1"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Composer
            </h1>
            <p
              className="text-sm"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Select content to edit or create new
            </p>
          </div>
          <button
            onClick={onNew}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{
              background: "hsl(var(--primary))",
              color: "white",
            }}
          >
            + New
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-1">
            {FILTER_TYPES.map((ft) => (
              <button
                key={ft.value}
                onClick={() => setFilterType(ft.value)}
                className="px-3 py-1 rounded-full text-xs font-medium transition-colors"
                style={{
                  background: filterType === ft.value ? "hsl(var(--foreground))" : "hsl(var(--muted))",
                  color: filterType === ft.value ? "hsl(var(--background))" : "hsl(var(--muted-foreground))",
                }}
              >
                {ft.label}
              </button>
            ))}
          </div>
          <div
            className="w-px h-5"
            style={{ background: "hsl(var(--border))" }}
          />
          <div className="flex items-center gap-1">
            {FILTER_LANGS.map((fl) => (
              <button
                key={fl.value}
                onClick={() => setFilterLang(fl.value)}
                className="px-3 py-1 rounded-full text-xs font-medium transition-colors"
                style={{
                  background: filterLang === fl.value ? "hsl(var(--foreground))" : "hsl(var(--muted))",
                  color: filterLang === fl.value ? "hsl(var(--background))" : "hsl(var(--muted-foreground))",
                }}
              >
                {fl.label}
              </button>
            ))}
          </div>
          <span
            className="text-xs ml-auto"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            {filtered.length} item{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loading ? (
          <p style={{ color: "hsl(var(--muted-foreground))" }}>Loading...</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: "hsl(var(--muted-foreground))" }}>
            {items.length === 0
              ? 'No content yet. Click "+ New" to create your first piece.'
              : "No content matches the current filters."}
          </p>
        ) : (
          <div className="space-y-2">
            {filtered.map((item) => {
              const sColors = statusColors[item.status] || statusColors.draft;
              const cColors = collectionColors[item.collectionLabel] || collectionColors.Blog;
              const lColors = localeColors[item.locale] || localeColors.en;
              return (
                <button
                  key={`${item.collection}-${item.slug}`}
                  onClick={() => onSelect(item)}
                  className="w-full text-left rounded-lg border p-4 transition-colors hover:border-gray-400 flex items-center gap-3"
                  style={{
                    background: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.title}</p>
                    <p
                      className="text-xs mt-1"
                      style={{ color: "hsl(var(--muted-foreground))" }}
                    >
                      {item.date}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <span
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{ background: cColors.bg, color: cColors.text }}
                    >
                      {item.collectionLabel}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded text-xs font-medium uppercase"
                      style={{ background: lColors.bg, color: lColors.text }}
                    >
                      {item.locale}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded text-xs font-medium capitalize"
                      style={{ background: sColors.bg, color: sColors.text }}
                    >
                      {item.status}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
