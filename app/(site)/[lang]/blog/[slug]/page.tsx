import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { draftMode } from "next/headers";
import { getPost, getPosts } from "@/lib/content";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { DocsLayout } from "@/components/content/docs-layout";
import { ArticleHeader } from "@/components/content/article-header";
import { ArticleFooter } from "@/components/content/article-footer";
import { extractHeadings } from "@/lib/headings";

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

  const dm = await draftMode();
  const isDev = process.env.VERCEL_ENV !== "production";
  if (!isDev && !dm.isEnabled && post.status !== "published") notFound();

  const headings = extractHeadings(post.body);

  return (
    <DocsLayout
      headings={headings}
      header={
        <ArticleHeader
          title={post.title}
          date={post.date}
          author={post.author}
          tags={post.tags as string[] ?? undefined}
        />
      }
      footer={
        <ArticleFooter backHref={`/${lang}/blog`} backLabel="Back to Blog" />
      }
    >
      <MDXRemote source={post.body} components={mdxComponents} />
    </DocsLayout>
  );
}
