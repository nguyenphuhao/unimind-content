"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MobileNav } from "@/components/layout/mobile-nav";

const navLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/handbook", label: "Handbook" },
];

export function SiteHeader({ lang }: { lang: string }) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      <header
        className="sticky top-0 bg-card border-b border-border"
        style={{ zIndex: "var(--z-sticky)", height: "var(--header-height)" }}
      >
        <div className="mx-auto flex h-full items-center justify-between px-4 sm:px-6" style={{ maxWidth: "var(--content-max)" }}>
          <div className="flex items-center gap-8">
            <Link href={`/${lang}`} className="text-lg font-bold" style={{ color: "hsl(var(--primary))" }}>
              Unimind
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => {
                const fullHref = `/${lang}${link.href}`;
                const isActive = pathname.startsWith(fullHref);
                return (
                  <Link
                    key={link.href}
                    href={fullHref}
                    className={cn(
                      "text-sm font-medium pb-0.5 transition-colors",
                      isActive
                        ? "text-primary border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <LanguageSwitcher currentLang={lang} />
            </div>
            <button
              className="md:hidden flex flex-col gap-1.5 p-2"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open menu"
            >
              <span className="block w-5 h-0.5 bg-foreground rounded" />
              <span className="block w-5 h-0.5 bg-foreground rounded" />
              <span className="block w-5 h-0.5 bg-foreground rounded" />
            </button>
          </div>
        </div>
      </header>
      <MobileNav
        lang={lang}
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />
    </>
  );
}
