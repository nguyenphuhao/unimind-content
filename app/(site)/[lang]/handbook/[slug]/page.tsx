import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getHandbookEntry, getHandbookEntries } from "@/lib/content";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { DocsLayout } from "@/components/content/docs-layout";
import { ArticleHeader } from "@/components/content/article-header";
import { ArticleFooter } from "@/components/content/article-footer";
import { extractHeadings } from "@/lib/headings";

export async function generateStaticParams() {
  const entries = await getHandbookEntries();
  return entries.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getHandbookEntry(slug);
  if (!entry) return {};
  return {
    title: `${entry.title} — Unimind Handbook`,
    description: entry.body.slice(0, 160).replace(/[#*\n]/g, "").trim(),
    openGraph: { title: entry.title, type: "article" },
  };
}

export default async function HandbookEntryPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const entry = await getHandbookEntry(slug);

  if (!entry) notFound();

  const isDev = process.env.VERCEL_ENV !== "production";
  if (!isDev && entry.status !== "published") notFound();

  const headings = extractHeadings(entry.body);

  return (
    <DocsLayout
      headings={headings}
      header={<ArticleHeader title={entry.title} section={entry.section} />}
      footer={<ArticleFooter backHref={`/${lang}/handbook`} backLabel="Back to Handbook" />}
    >
      <MDXRemote source={entry.body} components={mdxComponents} />
    </DocsLayout>
  );
}
