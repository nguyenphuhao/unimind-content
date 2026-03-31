import Link from "next/link";

interface ArticleFooterProps {
  backHref: string;
  backLabel: string;
  isEmbedded?: boolean;
}

export function ArticleFooter({ backHref, backLabel, isEmbedded }: ArticleFooterProps) {
  if (isEmbedded) return null;

  return (
    <footer className="mt-12 pt-6 border-t border-border">
      <Link
        href={backHref}
        className="text-sm font-medium hover:underline"
        style={{ color: "hsl(var(--primary))" }}
      >
        ← {backLabel}
      </Link>
    </footer>
  );
}
