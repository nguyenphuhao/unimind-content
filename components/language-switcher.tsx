"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LanguageSwitcherInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("lang") ?? "en";

  function switchLang(lang: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", lang);
    router.push(`${pathname}?${params.toString()}`);
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
          current === "en"
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
          current === "vi"
            ? { background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }
            : { color: "hsl(var(--muted-foreground))" }
        }
      >
        VI
      </button>
    </div>
  );
}

export function LanguageSwitcher() {
  return (
    <Suspense fallback={null}>
      <LanguageSwitcherInner />
    </Suspense>
  );
}
