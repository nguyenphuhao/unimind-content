import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <header
        className="border-b px-6 py-4 flex items-center justify-between"
        style={{ background: "hsl(var(--card))" }}
      >
        <Link
          href="/admin/ai"
          className="font-bold"
          style={{ color: "hsl(var(--primary))" }}
        >
          Unimind Content Admin
        </Link>
        <nav className="flex gap-4 text-sm">
          <Link
            href="/admin/ai"
            style={{ color: "hsl(var(--foreground))" }}
            className="hover:opacity-70"
          >
            AI Writer
          </Link>
          <Link
            href="/keystatic"
            style={{ color: "hsl(var(--foreground))" }}
            className="hover:opacity-70"
          >
            Keystatic →
          </Link>
          <Link
            href="/"
            style={{ color: "hsl(var(--foreground))" }}
            className="hover:opacity-70"
          >
            View Site
          </Link>
        </nav>
      </header>
      {children}
    </div>
  );
}
