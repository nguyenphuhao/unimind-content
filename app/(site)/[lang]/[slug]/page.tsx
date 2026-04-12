import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { draftMode } from "next/headers";
import { getPage, getPages } from "@/lib/content";
import { mdxComponents } from "@/components/mdx/mdx-components";

export async function generateStaticParams() {
  const pages = await getPages();
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) return {};
  return {
    title: `${page.title} — Unimind`,
    description: page.description || page.body.slice(0, 160).replace(/[#*\n]/g, "").trim(),
    openGraph: {
      title: page.title,
      description: page.description || undefined,
    },
  };
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPage(slug);

  if (!page) notFound();

  const dm = await draftMode();
  const isDev = process.env.VERCEL_ENV !== "production";
  if (!isDev && !dm.isEnabled && page.status !== "published") notFound();

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-3">{page.title}</h1>
          {page.description && (
            <p
              className="text-xl"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              {page.description}
            </p>
          )}
        </header>
        <div className="prose max-w-none">
          <MDXRemote source={page.body} components={mdxComponents} />
        </div>
      </article>
    </main>
  );
}
