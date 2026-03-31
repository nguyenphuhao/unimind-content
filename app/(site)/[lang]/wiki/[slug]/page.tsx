import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getWikiArticle, getWikiArticles } from "@/lib/content";
import { mdxComponents } from "@/components/mdx/mdx-components";
import Link from "next/link";

export async function generateStaticParams() {
  const articles = await getWikiArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getWikiArticle(slug);
  if (!article) return {};
  return {
    title: `${article.title} — Unimind Wiki`,
    description: article.body.slice(0, 160).replace(/[#*\n]/g, "").trim(),
    openGraph: {
      title: article.title,
      type: "article",
    },
  };
}

export default async function WikiArticlePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const article = await getWikiArticle(slug);

  if (!article) notFound();

  const isDev = process.env.VERCEL_ENV !== "production";
  if (!isDev && article.status !== "published") notFound();

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href={`/${lang}/wiki`}
        className="text-sm mb-6 inline-block hover:underline"
        style={{ color: "hsl(var(--primary))" }}
      >
        ← Back to Wiki
      </Link>
      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-3">{article.title}</h1>
          {article.category && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: "hsl(var(--secondary) / 0.15)",
                color: "hsl(var(--secondary))",
              }}
            >
              {article.category}
            </span>
          )}
        </header>
        <div className="prose max-w-none">
          <MDXRemote source={article.body} components={mdxComponents} />
        </div>
      </article>
    </main>
  );
}
