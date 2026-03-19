import Link from "next/link";
import { getPosts, getWikiArticles, getHandbookEntries } from "@/lib/content";

export default async function HomePage() {
  const [posts, wiki, handbook] = await Promise.all([
    getPosts(),
    getWikiArticles(),
    getHandbookEntries(),
  ]);

  const recentPosts = posts.slice(0, 3);

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section
        style={{
          background: "hsl(var(--primary))",
          color: "hsl(var(--primary-foreground))",
        }}
        className="px-6 py-20 text-center"
      >
        <h1 className="text-4xl font-bold mb-4">Unimind Content</h1>
        <p className="text-xl opacity-90 max-w-2xl mx-auto">
          Documentation, guides, and resources for the Unimind platform.
        </p>
      </section>

      {/* Quick Links */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/blog"
          className="block p-6 rounded-lg border"
          style={{ background: "hsl(var(--card))" }}
        >
          <h2
            className="text-xl font-semibold mb-2"
            style={{ color: "hsl(var(--primary))" }}
          >
            Blog
          </h2>
          <p style={{ color: "hsl(var(--muted-foreground))" }}>
            {posts.length} posts published
          </p>
        </Link>
        <Link
          href="/wiki"
          className="block p-6 rounded-lg border"
          style={{ background: "hsl(var(--card))" }}
        >
          <h2
            className="text-xl font-semibold mb-2"
            style={{ color: "hsl(var(--primary))" }}
          >
            Wiki
          </h2>
          <p style={{ color: "hsl(var(--muted-foreground))" }}>
            {wiki.length} articles
          </p>
        </Link>
        <Link
          href="/handbook"
          className="block p-6 rounded-lg border"
          style={{ background: "hsl(var(--card))" }}
        >
          <h2
            className="text-xl font-semibold mb-2"
            style={{ color: "hsl(var(--primary))" }}
          >
            Handbook
          </h2>
          <p style={{ color: "hsl(var(--muted-foreground))" }}>
            {handbook.length} entries
          </p>
        </Link>
      </section>

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <h2 className="text-2xl font-bold mb-6">Recent Posts</h2>
          <div className="grid gap-4">
            {recentPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block p-5 rounded-lg border"
                style={{ background: "hsl(var(--card))" }}
              >
                <h3 className="font-semibold text-lg">{post.entry.title}</h3>
                <p style={{ color: "hsl(var(--muted-foreground))" }}>
                  {post.entry.date} · {post.entry.author}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
