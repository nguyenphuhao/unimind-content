"use client";

import { useRouter, usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";

export function LanguageSwitcher({ currentLang }: { currentLang: string }) {
  const router = useRouter();
  const pathname = usePathname();

  function switchLang(lang: string) {
    const segments = pathname.split("/");
    if (segments.length > 1 && locales.includes(segments[1] as Locale)) {
      segments[1] = lang;
    }
    router.push(segments.join("/"));
  }

  return (
    <div
      className="flex items-center gap-1 rounded-lg p-1 text-xs font-medium"
      style={{ background: "hsl(var(--muted))" }}
    >
      <button
        onClick={() => switchLang("en")}
        className="px-2 py-1 rounded-md transition-all"
        style={
          currentLang === "en"
            ? { background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }
            : { color: "hsl(var(--muted-foreground))" }
        }
      >
        EN
      </button>
      <button
        onClick={() => switchLang("vi")}
        className="px-2 py-1 rounded-md transition-all"
        style={
          currentLang === "vi"
            ? { background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }
            : { color: "hsl(var(--muted-foreground))" }
        }
      >
        VI
      </button>
    </div>
  );
}
