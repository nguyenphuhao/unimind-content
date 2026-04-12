import type { Metadata } from "next";
import { getPosts } from "@/lib/content";
import { ListFeed } from "@/components/content/list-feed";

export const metadata: Metadata = {
  title: "Blog — Unimind",
  description: "Latest articles and updates from Unimind.",
  openGraph: { title: "Unimind Blog" },
};

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const posts = await getPosts(lang);

  const items = posts.map((post) => ({
    slug: post.slug as string,
    title: post.title as string,
    meta: [post.author, post.date].filter(Boolean).join(" · "),
    tags: (post.tags as string[]) ?? undefined,
    coverImage: (post.coverImage as string | null | undefined) ?? null,
  }));

  return (
    <div className="py-6 md:py-10 px-4 sm:px-6">
      <div className="mx-auto" style={{ maxWidth: "var(--content-max)" }}>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Blog</h1>
        <p className="text-muted-foreground mb-8">Latest articles and updates</p>
        <ListFeed items={items} basePath={`/${lang}/blog`} emptyMessage="No posts published yet." />
      </div>
    </div>
  );
}
