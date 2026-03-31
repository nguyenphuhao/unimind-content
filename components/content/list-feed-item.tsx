import Link from "next/link";

interface ListFeedItemProps {
  href: string;
  title: string;
  meta?: string;
  tags?: string[];
  coverImage?: string | null;
  order?: number;
}

export function ListFeedItem({ href, title, meta, tags, coverImage, order }: ListFeedItemProps) {
  return (
    <Link
      href={href}
      className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border border-border md:border-0 md:bg-card transition-all hover:-translate-y-[1px]"
      style={{ boxShadow: "var(--shadow-sm)" }}
    >
      {order != null && (
        <div
          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ background: "hsl(var(--primary-10))", color: "hsl(var(--primary))" }}
        >
          {order}
        </div>
      )}
      {coverImage && !order && (
        <div
          className="flex-shrink-0 w-13 h-10 sm:w-18 sm:h-13 lg:w-22 lg:h-16 rounded-md bg-cover bg-center"
          style={{ backgroundImage: `url(${coverImage})` }}
        />
      )}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm sm:text-base font-semibold leading-snug mb-0.5 line-clamp-2">
          {title}
        </h3>
        {meta && (
          <p className="text-xs text-muted-foreground">{meta}</p>
        )}
        {tags && tags.length > 0 && (
          <div className="flex gap-1.5 mt-1.5 flex-wrap">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-semibold px-2 py-0.5"
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
      </div>
    </Link>
  );
}
