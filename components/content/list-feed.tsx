import { ListFeedItem } from "@/components/content/list-feed-item";

interface FeedItem {
  slug: string;
  title: string;
  meta?: string;
  tags?: string[];
  coverImage?: string | null;
  group?: string;
  order?: number;
}

interface ListFeedProps {
  items: FeedItem[];
  basePath: string;
  groupBy?: boolean;
  emptyMessage?: string;
}

export function ListFeed({ items, basePath, groupBy, emptyMessage = "No content yet." }: ListFeedProps) {
  if (items.length === 0) {
    return <p className="text-muted-foreground">{emptyMessage}</p>;
  }

  if (groupBy) {
    const groups: Record<string, FeedItem[]> = {};
    for (const item of items) {
      const key = item.group || "General";
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    }

    return (
      <div className="space-y-8">
        {Object.entries(groups).map(([group, groupItems]) => (
          <div key={group}>
            <h2
              className="text-sm font-bold uppercase tracking-wide mb-3"
              style={{ color: "hsl(var(--primary))" }}
            >
              {group}
            </h2>
            <div className="flex flex-col gap-3">
              {groupItems.map((item) => (
                <ListFeedItem
                  key={item.slug}
                  href={`${basePath}/${item.slug}`}
                  title={item.title}
                  meta={item.meta}
                  tags={item.tags}
                  coverImage={item.coverImage}
                  order={item.order}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <ListFeedItem
          key={item.slug}
          href={`${basePath}/${item.slug}`}
          title={item.title}
          meta={item.meta}
          tags={item.tags}
          coverImage={item.coverImage}
        />
      ))}
    </div>
  );
}
