import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getHandbookEntry, getHandbookEntries } from "@/lib/content";
import { mdxComponents } from "@/components/mdx/mdx-components";
import Link from "next/link";

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
    openGraph: {
      title: entry.title,
      type: "article",
    },
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

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href={`/${lang}/handbook`}
        className="text-sm mb-6 inline-block hover:underline"
        style={{ color: "hsl(var(--primary))" }}
      >
        ← Back to Handbook
      </Link>
      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-3">{entry.title}</h1>
          {entry.section && (
            <p
              className="text-sm"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Section: {entry.section}
            </p>
          )}
        </header>
        <div className="prose max-w-none">
          <MDXRemote source={entry.body} components={mdxComponents} />
        </div>
      </article>
    </main>
  );
}
