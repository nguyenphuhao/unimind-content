import { cn } from "@/lib/utils";

interface ArticleHeaderProps {
  title: string;
  date?: string | null;
  author?: string | null;
  tags?: string[];
  category?: string | null;
  section?: string | null;
  centered?: boolean;
}

export function ArticleHeader({
  title,
  date,
  author,
  tags,
  category,
  section,
  centered = false,
}: ArticleHeaderProps) {
  return (
    <header className={cn("mb-8", centered && "text-center")}>
      {tags && tags.length > 0 && (
        <div className={cn("flex gap-2 mb-3 flex-wrap", centered && "justify-center")}>
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-semibold px-2.5 py-0.5"
              style={{
                background: "hsl(var(--primary-10))",
                color: "hsl(var(--primary))",
                borderRadius: "var(--radius-pill)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      {category && (
        <span
          className="text-xs font-semibold px-2.5 py-0.5 mb-3 inline-block"
          style={{
            background: "hsl(var(--secondary) / 0.15)",
            color: "hsl(var(--secondary))",
            borderRadius: "var(--radius-pill)",
          }}
        >
          {category}
        </span>
      )}
      {section && (
        <p className="text-sm text-muted-foreground mb-2">
          {section}
        </p>
      )}
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 leading-tight font-display">
        {title}
      </h1>
      {(date || author) && (
        <p className="text-sm text-muted-foreground">
          {[author, date].filter(Boolean).join(" · ")}
        </p>
      )}
    </header>
  );
}
