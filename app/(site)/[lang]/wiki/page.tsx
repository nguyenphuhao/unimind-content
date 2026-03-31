import type { Metadata } from "next";
import Link from "next/link";
import { getWikiArticles } from "@/lib/content";

export const metadata: Metadata = {
  title: "Wiki — Unimind",
  description: "Reference documentation and knowledge base.",
  openGraph: { title: "Unimind Wiki" },
};

export default async function WikiPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const articles = await getWikiArticles(lang);

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Wiki</h1>
      <p className="mb-8" style={{ color: "hsl(var(--muted-foreground))" }}>
        Reference documentation and knowledge base
      </p>

      {articles.length === 0 ? (
        <p style={{ color: "hsl(var(--muted-foreground))" }}>
          No wiki articles yet.
        </p>
      ) : (
        <div className="grid gap-4">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/${lang}/wiki/${article.slug}`}
              className="block p-6 rounded-lg border hover:border-primary transition-colors"
              style={{ background: "hsl(var(--card))" }}
            >
              <h2 className="text-xl font-semibold mb-1">
                {article.entry.title}
              </h2>
              {article.entry.category && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: "hsl(var(--secondary) / 0.15)",
                    color: "hsl(var(--secondary))",
                  }}
                >
                  {article.entry.category}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
