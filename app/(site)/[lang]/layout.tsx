import Link from "next/link";
import Image from "next/image";
import { LanguageSwitcher } from "@/components/language-switcher";
import { locales } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function SiteLangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

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
              href={`/${lang}/blog`}
              style={{ color: "hsl(var(--foreground))" }}
              className="hover:opacity-70 transition-opacity"
            >
              Blog
            </Link>
            <Link
              href={`/${lang}/wiki`}
              style={{ color: "hsl(var(--foreground))" }}
              className="hover:opacity-70 transition-opacity"
            >
              Wiki
            </Link>
            <Link
              href={`/${lang}/handbook`}
              style={{ color: "hsl(var(--foreground))" }}
              className="hover:opacity-70 transition-opacity"
            >
              Handbook
            </Link>
          </nav>
          <LanguageSwitcher currentLang={lang} />
        </div>
      </header>
      {children}
      <footer
        className="border-t px-6 py-8 text-center text-sm"
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        &copy; {new Date().getFullYear()} Unimind. All rights reserved.
      </footer>
    </div>
  );
}
