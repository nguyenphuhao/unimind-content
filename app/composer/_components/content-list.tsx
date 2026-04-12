"use client";

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
  published: { bg: "hsl(160 84% 39% / 0.1)", text: "hsl(160 84% 39%)" },
  draft: { bg: "hsl(38 92% 50% / 0.1)", text: "hsl(38 92% 50%)" },
};

export function ContentList({ items, loading, onSelect, onNew }: ContentListProps) {
  return (
    <div
      className="min-h-screen px-6 py-12"
      style={{ background: "hsl(var(--background))" }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
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

        {loading ? (
          <p style={{ color: "hsl(var(--muted-foreground))" }}>Loading...</p>
        ) : items.length === 0 ? (
          <p style={{ color: "hsl(var(--muted-foreground))" }}>
            No content yet. Click &quot;+ New&quot; to create your first piece.
          </p>
        ) : (
          <div className="space-y-2">
            {items.map((item) => {
              const colors = statusColors[item.status] || statusColors.draft;
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
                      style={{
                        background: "hsl(var(--muted))",
                        color: "hsl(var(--muted-foreground))",
                      }}
                    >
                      {item.collectionLabel}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded text-xs font-medium uppercase"
                      style={{
                        background: "hsl(var(--muted))",
                        color: "hsl(var(--muted-foreground))",
                      }}
                    >
                      {item.locale}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded text-xs font-medium capitalize"
                      style={{ background: colors.bg, color: colors.text }}
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
