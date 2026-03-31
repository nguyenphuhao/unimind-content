import type { Metadata } from "next";
import { getWikiArticles } from "@/lib/content";
import { ListFeed } from "@/components/content/list-feed";

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

  const items = articles.map((article) => ({
    slug: article.slug,
    title: article.entry.title,
    meta: article.entry.date ?? undefined,
    group: article.entry.category ?? undefined,
  }));

  return (
    <div className="py-6 md:py-10 px-4 sm:px-6">
      <div className="mx-auto" style={{ maxWidth: "var(--content-wide)" }}>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Wiki</h1>
        <p className="text-muted-foreground mb-8">Reference documentation and knowledge base</p>
        <ListFeed items={items} basePath={`/${lang}/wiki`} groupBy emptyMessage="No wiki articles yet." />
      </div>
    </div>
  );
}
