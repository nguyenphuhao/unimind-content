"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/language-switcher";

const navLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/handbook", label: "Handbook" },
];

interface MobileNavProps {
  lang: string;
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ lang, open, onClose }: MobileNavProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0" style={{ zIndex: "var(--z-overlay)" }}>
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <nav
        className="absolute top-0 left-0 h-full w-3/4 max-w-xs bg-card p-6 flex flex-col"
        style={{
          boxShadow: "var(--shadow-lg)",
          animation: "slideIn var(--duration-normal) var(--ease-default)",
        }}
      >
        <div className="flex items-center justify-between mb-8">
          <Link
            href={`/${lang}`}
            className="text-lg font-bold"
            style={{ color: "hsl(var(--primary))" }}
            onClick={onClose}
          >
            Unimind
          </Link>
          <button onClick={onClose} className="text-muted-foreground text-xl" aria-label="Close menu">
            ✕
          </button>
        </div>
        <div className="flex flex-col gap-1">
          {navLinks.map((link) => {
            const fullHref = `/${lang}${link.href}`;
            const isActive = pathname.startsWith(fullHref);
            return (
              <Link
                key={link.href}
                href={fullHref}
                onClick={onClose}
                className={cn(
                  "py-3 border-b border-border text-sm font-medium",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
        <div className="mt-auto pt-6 border-t border-border">
          <LanguageSwitcher currentLang={lang} />
        </div>
      </nav>
    </div>
  );
}
