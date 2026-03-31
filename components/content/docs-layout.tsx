import { TableOfContents, InlineTableOfContents } from "@/components/content/table-of-contents";
import type { Heading } from "@/lib/headings";

interface DocsLayoutProps {
  header: React.ReactNode;
  children: React.ReactNode;
  footer: React.ReactNode;
  headings: Heading[];
}

export function DocsLayout({ header, children, footer, headings }: DocsLayoutProps) {
  return (
    <div className="py-6 md:py-10 px-4 sm:px-6">
      <div className="mx-auto" style={{ maxWidth: "var(--content-max)" }}>
        <div className="lg:flex lg:gap-6">
          <article className="flex-1 min-w-0 md:bg-card md:rounded-xl md:p-8" style={{ boxShadow: "var(--shadow-sm)" }}>
            {header}
            <div className="lg:hidden">
              <InlineTableOfContents headings={headings} />
            </div>
            <div className="prose max-w-none leading-relaxed">
              {children}
            </div>
            {footer}
          </article>

          <aside className="hidden lg:block" style={{ width: "var(--sidebar-width)", flexShrink: 0 }}>
            <div
              className="sticky bg-card rounded-xl p-4"
              style={{ top: "calc(var(--header-height) + 16px)", boxShadow: "var(--shadow-sm)" }}
            >
              <TableOfContents headings={headings} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
