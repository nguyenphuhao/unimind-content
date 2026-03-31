import { headers } from "next/headers";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

interface ContentShellProps {
  children: React.ReactNode;
  lang: string;
  searchParams?: Record<string, string | string[] | undefined>;
}

export async function ContentShell({ children, lang, searchParams }: ContentShellProps) {
  const headersList = await headers();
  const isEmbedded =
    searchParams?.source === "dokifree-app" ||
    headersList.get("x-dokifree-app") === "true";

  if (isEmbedded) {
    return (
      <div className="min-h-screen bg-white" style={{ padding: "12px" }}>
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader lang={lang} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
