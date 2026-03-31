import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPost, getPosts } from "@/lib/content";
import { mdxComponents } from "@/components/mdx/mdx-components";
import Link from "next/link";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Unimind Blog`,
    description: post.body.slice(0, 160).replace(/[#*\n]/g, "").trim(),
    openGraph: {
      title: post.title,
      type: "article",
      publishedTime: post.date ?? undefined,
      authors: post.author ? [post.author] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const isDev = process.env.VERCEL_ENV !== "production";
  if (!isDev && post.status !== "published") notFound();

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href={`/${lang}/blog`}
        className="text-sm mb-6 inline-block hover:underline"
        style={{ color: "hsl(var(--primary))" }}
      >
        ← Back to Blog
      </Link>
      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-3">{post.title}</h1>
          <p
            className="text-sm"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            {post.date} · {post.author}
          </p>
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {post.tags.map((tag) => (
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
        </header>
        <div className="prose max-w-none">
          <MDXRemote source={post.body} components={mdxComponents} />
        </div>
      </article>
    </main>
  );
}
