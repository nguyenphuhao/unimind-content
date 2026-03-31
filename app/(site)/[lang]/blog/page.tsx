import type { Metadata } from "next";
import Link from "next/link";
import { getPosts } from "@/lib/content";

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

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Blog</h1>
      <p className="mb-8" style={{ color: "hsl(var(--muted-foreground))" }}>
        Latest articles and updates
      </p>

      {posts.length === 0 ? (
        <p style={{ color: "hsl(var(--muted-foreground))" }}>
          No posts published yet.
        </p>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/${lang}/blog/${post.slug}`}
              className="block p-6 rounded-lg border hover:border-primary transition-colors"
              style={{ background: "hsl(var(--card))" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold mb-1">
                    {post.entry.title}
                  </h2>
                  <p
                    className="text-sm"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    {post.entry.date} · {post.entry.author}
                  </p>
                  {post.entry.tags && post.entry.tags.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {post.entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            background: "hsl(var(--accent))",
                            color: "hsl(var(--accent-foreground))",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
