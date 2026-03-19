import Link from "next/link";
import Image from "next/image";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function SiteLayout({
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
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/dokifree-logo.svg"
            alt="Unimind"
            width={32}
            height={32}
            priority
          />
          <span className="font-bold text-lg" style={{ color: "hsl(var(--primary))" }}>
            Unimind
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <nav className="flex gap-6 text-sm">
            <Link
              href="/blog"
              style={{ color: "hsl(var(--foreground))" }}
              className="hover:opacity-70 transition-opacity"
            >
              Blog
            </Link>
            <Link
              href="/wiki"
              style={{ color: "hsl(var(--foreground))" }}
              className="hover:opacity-70 transition-opacity"
            >
              Wiki
            </Link>
            <Link
              href="/handbook"
              style={{ color: "hsl(var(--foreground))" }}
              className="hover:opacity-70 transition-opacity"
            >
              Handbook
            </Link>
          </nav>
          <LanguageSwitcher />
        </div>
      </header>
      {children}
      <footer
        className="border-t px-6 py-8 text-center text-sm"
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        © {new Date().getFullYear()} Unimind. All rights reserved.
      </footer>
    </div>
  );
}
