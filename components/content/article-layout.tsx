interface ArticleLayoutProps {
  header: React.ReactNode;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export function ArticleLayout({ header, children, footer }: ArticleLayoutProps) {
  return (
    <div className="py-6 md:py-10 px-4 sm:px-6">
      <div className="mx-auto" style={{ maxWidth: "var(--content-max)" }}>
        <article className="md:bg-card md:rounded-xl md:p-8 lg:p-10" style={{ boxShadow: "var(--shadow-sm)" }}>
          {header}
          <div className="prose max-w-none leading-relaxed">
            {children}
          </div>
          {footer}
        </article>
      </div>
    </div>
  );
}
