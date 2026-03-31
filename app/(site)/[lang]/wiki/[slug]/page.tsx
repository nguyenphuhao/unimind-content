import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getWikiArticle, getWikiArticles } from "@/lib/content";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { DocsLayout } from "@/components/content/docs-layout";
import { ArticleHeader } from "@/components/content/article-header";
import { ArticleFooter } from "@/components/content/article-footer";
import { extractHeadings } from "@/lib/headings";

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
    openGraph: { title: article.title, type: "article" },
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

  const headings = extractHeadings(article.body);

  return (
    <DocsLayout
      headings={headings}
      header={<ArticleHeader title={article.title} category={article.category} />}
      footer={<ArticleFooter backHref={`/${lang}/wiki`} backLabel="Back to Wiki" />}
    >
      <MDXRemote source={article.body} components={mdxComponents} />
    </DocsLayout>
  );
}
