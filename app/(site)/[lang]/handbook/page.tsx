import type { Metadata } from "next";
import { getHandbookEntries } from "@/lib/content";
import { ListFeed } from "@/components/content/list-feed";

export const metadata: Metadata = {
  title: "Handbook — Unimind",
  description: "Team guidelines, processes, and best practices.",
  openGraph: { title: "Unimind Handbook" },
};

export default async function HandbookPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const entries = await getHandbookEntries(lang);

  const items = entries.map((entry) => ({
    slug: entry.slug,
    title: entry.entry.title,
    group: entry.entry.section ?? undefined,
    order: entry.entry.order ?? undefined,
  }));

  return (
    <div className="py-6 md:py-10 px-4 sm:px-6">
      <div className="mx-auto" style={{ maxWidth: "var(--content-wide)" }}>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Handbook</h1>
        <p className="text-muted-foreground mb-8">Team guidelines, processes, and best practices</p>
        <ListFeed items={items} basePath={`/${lang}/handbook`} groupBy emptyMessage="No handbook entries yet." />
      </div>
    </div>
  );
}
