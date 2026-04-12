# Content Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign Blog, Wiki, Handbook layouts with responsive design tokens, reusable components, and webview support for dokifree app.

**Architecture:** Component-first approach — shared layout primitives (ContentShell, ArticleLayout, DocsLayout, ListFeed) composed per content type. Design tokens refactored in globals.css. Webview detected via `?source=dokifree-app` query param or `X-Dokifree-App` header.

**Tech Stack:** Next.js 16 App Router, Tailwind CSS 4, TypeScript, next-mdx-remote, cn() utility

---

## File Map

### Create
- `components/layout/content-shell.tsx` — Embedded detection + conditional header/footer
- `components/layout/site-header.tsx` — Responsive header with nav + lang switcher
- `components/layout/site-footer.tsx` — Minimal footer
- `components/layout/mobile-nav.tsx` — Slide-out drawer
- `components/content/article-layout.tsx` — Blog detail (Medium-like centered)
- `components/content/docs-layout.tsx` — Wiki/Handbook detail (content + TOC sidebar)
- `components/content/list-feed.tsx` — Listing page feed container
- `components/content/list-feed-item.tsx` — Individual feed card
- `components/content/table-of-contents.tsx` — TOC sidebar + inline variants
- `components/content/article-header.tsx` — Title, meta, tags
- `components/content/article-footer.tsx` — Back link, related posts
- `lib/headings.ts` — Extract headings from MDX body for TOC

### Modify
- `app/globals.css` — Refactor design tokens, remove dark mode
- `app/(site)/layout.tsx` — Use ContentShell
- `app/(site)/[lang]/blog/page.tsx` — Use ListFeed
- `app/(site)/[lang]/blog/[slug]/page.tsx` — Use ArticleLayout
- `app/(site)/[lang]/wiki/page.tsx` — Use ListFeed (groupBy category)
- `app/(site)/[lang]/wiki/[slug]/page.tsx` — Use DocsLayout
- `app/(site)/[lang]/handbook/page.tsx` — Use ListFeed (groupBy section, ordered)
- `app/(site)/[lang]/handbook/[slug]/page.tsx` — Use DocsLayout
- `components/mdx/mdx-components.tsx` — Add id to headings for TOC anchors

---

### Task 1: Refactor Design Tokens

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Remove dark mode block and add new tokens**

Replace the entire `app/globals.css` with:

```css
@import "tailwindcss";
@import "tw-animate-css";

:root {
  /* Colors — keep existing */
  --background: var(--gray-6);
  --foreground: 0 0% 20%;
  --card: 0 0% 100%;
  --card-foreground: 0 0% 20%;
  --popover: 0 0% 100%;
  --popover-foreground: 0 0% 20%;
  --primary: 256 52% 45%;
  --primary-10: 234 100% 94%;
  --primary-50: 233 88% 90%;
  --primary-100: 240 43% 80%;
  --primary-200: 248 42% 72%;
  --primary-300: 252 43% 63%;
  --primary-400: 250 43% 54%;
  --primary-500: 256 52% 45%;
  --primary-600: 261 54% 33%;
  --primary-800: 260 47% 20%;
  --primary-foreground: 0 0% 100%;
  --secondary: 27 81% 52%;
  --secondary-50: 27 83% 86%;
  --secondary-100: 27 82% 83%;
  --secondary-200: 27 81% 75%;
  --secondary-300: 27 81% 67%;
  --secondary-400: 27 82% 59%;
  --secondary-500: 27 81% 52%;
  --secondary-600: 27 76% 43%;
  --secondary-700: 27 77% 35%;
  --secondary-800: 27 77% 27%;
  --secondary-foreground: 0 0% 100%;
  --muted: 0 0% 93%;
  --muted-foreground: 0 0% 31%;
  --accent: 233 88% 90%;
  --accent-foreground: 255 48% 44%;
  --destructive: 0 78% 63%;
  --destructive-foreground: 0 0% 100%;
  --border: 0 0% 87%;
  --input: 0 0% 93%;
  --ring: 256 52% 45%;
  --info: 205 100% 52%;
  --success: 160 99% 33%;
  --warning: 47 100% 62%;
  --gray-1: 0 0% 20%;
  --gray-2: 0 0% 31%;
  --gray-3: 0 0% 60%;
  --gray-4: 0 0% 74%;
  --gray-5: 0 0% 87%;
  --gray-6: 0 0% 93%;
  --gray-dark: 0 0% 20%;
  --gray-medium: 0 0% 31%;
  --gray-light: 0 0% 60%;
  --chart-1: 255 60% 61%;
  --chart-2: 160 99% 33%;
  --chart-3: 205 100% 52%;
  --chart-4: 47 100% 62%;
  --chart-5: 27 100% 59%;
  --sidebar: 0 0% 93%;
  --sidebar-foreground: 0 0% 20%;
  --sidebar-primary: 256 52% 45%;
  --sidebar-primary-foreground: 0 0% 100%;
  --sidebar-accent: 233 88% 90%;
  --sidebar-accent-foreground: 260 47% 20%;
  --sidebar-border: 0 0% 87%;
  --sidebar-ring: 256 52% 45%;

  /* Layout */
  --content-width: 720px;
  --content-wide: 1024px;
  --content-max: 1280px;
  --sidebar-width: 240px;
  --header-height: 64px;

  /* Radius — extend existing */
  --radius: 0.75rem;
  --radius-pill: 100px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);

  /* Z-index */
  --z-base: 0;
  --z-dropdown: 10;
  --z-sticky: 20;
  --z-overlay: 30;
  --z-modal: 40;
  --z-toast: 50;

  /* Motion */
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 350ms;
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
}

@theme inline {
  --font-sans:
    "SF Pro Display", -apple-system, BlinkMacSystemFont, system-ui, "Roboto", sans-serif;
  --font-mono:
    "SF Mono", "SFMono-Regular", ui-monospace, Menlo, Monaco, Consolas, "Liberation Mono",
    "Courier New", monospace;
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));
  --color-info: hsl(var(--info));
  --color-success: hsl(var(--success));
  --color-warning: hsl(var(--warning));
  --color-gray-1: hsl(var(--gray-1));
  --color-gray-2: hsl(var(--gray-2));
  --color-gray-3: hsl(var(--gray-3));
  --color-gray-4: hsl(var(--gray-4));
  --color-gray-5: hsl(var(--gray-5));
  --color-gray-6: hsl(var(--gray-6));
  --color-sidebar: hsl(var(--sidebar));
  --color-sidebar-foreground: hsl(var(--sidebar-foreground));
  --color-sidebar-primary: hsl(var(--sidebar-primary));
  --color-sidebar-primary-foreground: hsl(var(--sidebar-primary-foreground));
  --color-sidebar-accent: hsl(var(--sidebar-accent));
  --color-sidebar-accent-foreground: hsl(var(--sidebar-accent-foreground));
  --color-sidebar-border: hsl(var(--sidebar-border));
  --color-sidebar-ring: hsl(var(--sidebar-ring));
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
}

* {
  border-color: hsl(var(--border));
}

html,
body {
  min-height: 100%;
  background: hsl(var(--background));
  color: hsl(var(--foreground));
  font-family: var(--font-sans);
  font-size: 16px;
  line-height: 24px;
}
```

- [ ] **Step 2: Verify dev server starts**

Run: `pnpm dev`
Expected: Server starts without CSS errors. Existing pages render with same colors.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "style: refactor design tokens, remove dark mode, add layout/motion/shadow tokens"
```

---

### Task 2: Layout Shell Components

**Files:**
- Create: `components/layout/site-header.tsx`
- Create: `components/layout/site-footer.tsx`
- Create: `components/layout/mobile-nav.tsx`
- Create: `components/layout/content-shell.tsx`
- Modify: `app/(site)/layout.tsx`

- [ ] **Step 1: Create SiteHeader**

```tsx
// components/layout/site-header.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MobileNav } from "@/components/layout/mobile-nav";

const navLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/wiki", label: "Wiki" },
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
```

- [ ] **Step 2: Create MobileNav**

```tsx
// components/layout/mobile-nav.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/language-switcher";

const navLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/wiki", label: "Wiki" },
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

  // Close on route change
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
```

- [ ] **Step 3: Add slideIn keyframe to globals.css**

Append before the closing of `app/globals.css`:

```css
@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
```

- [ ] **Step 4: Create SiteFooter**

```tsx
// components/layout/site-footer.tsx
export function SiteFooter() {
  return (
    <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
      © {new Date().getFullYear()} Unimind. All rights reserved.
    </footer>
  );
}
```

- [ ] **Step 5: Create ContentShell**

```tsx
// components/layout/content-shell.tsx
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
```

- [ ] **Step 6: Update site layout to use ContentShell**

Replace `app/(site)/layout.tsx`:

```tsx
// app/(site)/layout.tsx
import { ContentShell } from "@/components/layout/content-shell";

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang?: string }>;
}) {
  const { lang = "en" } = await params;

  return <ContentShell lang={lang}>{children}</ContentShell>;
}
```

Note: The `[lang]` segment is in a child route group, so `params.lang` may not be available here. If it's not, read `lang` from the first path segment instead. Check at runtime.

- [ ] **Step 7: Verify header/footer render**

Run: `pnpm dev`, navigate to `http://localhost:3000/en/blog`
Expected: New header with logo, nav links (Blog/Wiki/Handbook), lang switcher. Footer at bottom. Resize to mobile — hamburger appears, drawer works.

- [ ] **Step 8: Commit**

```bash
git add components/layout/ app/(site)/layout.tsx app/globals.css
git commit -m "feat: add ContentShell, SiteHeader, SiteFooter, MobileNav"
```

---

### Task 3: Heading Extraction Utility

**Files:**
- Create: `lib/headings.ts`

- [ ] **Step 1: Create heading extractor**

```tsx
// lib/headings.ts
export interface Heading {
  id: string;
  text: string;
  level: number;
}

export function extractHeadings(mdxBody: string): Heading[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match;

  while ((match = headingRegex.exec(mdxBody)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    headings.push({ id, text, level });
  }

  return headings;
}
```

- [ ] **Step 2: Update MDX components to add heading IDs**

Modify `components/mdx/mdx-components.tsx` — replace the h2 and h3 entries:

```tsx
h2: ({ children }) => {
  const id = String(children)
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
  return (
    <h2 id={id} className="text-2xl font-semibold mt-8 mb-3 scroll-mt-20">
      {children}
    </h2>
  );
},
h3: ({ children }) => {
  const id = String(children)
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
  return (
    <h3 id={id} className="text-xl font-semibold mt-6 mb-2 scroll-mt-20">
      {children}
    </h3>
  );
},
```

- [ ] **Step 3: Commit**

```bash
git add lib/headings.ts components/mdx/mdx-components.tsx
git commit -m "feat: add heading extraction utility and anchor IDs to MDX headings"
```

---

### Task 4: TableOfContents Component

**Files:**
- Create: `components/content/table-of-contents.tsx`

- [ ] **Step 1: Create TOC component**

```tsx
// components/content/table-of-contents.tsx
"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { Heading } from "@/lib/headings";

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px" }
    );

    for (const heading of headings) {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="text-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
        On this page
      </p>
      <ul className="space-y-0.5">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={cn(
                "block py-1.5 px-3 rounded-md transition-colors",
                heading.level === 3 && "pl-6",
                activeId === heading.id
                  ? "font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
              style={
                activeId === heading.id
                  ? { background: "hsl(var(--primary-10))", color: "hsl(var(--primary))" }
                  : undefined
              }
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function InlineTableOfContents({ headings }: TableOfContentsProps) {
  const [open, setOpen] = useState(false);

  if (headings.length === 0) return null;

  return (
    <div
      className="rounded-lg mb-6"
      style={{ background: "hsl(var(--primary-10))" }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-3 text-sm font-semibold"
        style={{ color: "hsl(var(--primary-600))" }}
      >
        <span className="text-xs uppercase tracking-wide">Table of Contents</span>
        <span className="text-xs">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <ul className="px-3 pb-3 space-y-1">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={cn(
                  "block py-1 text-sm",
                  heading.level === 3 && "pl-4"
                )}
                style={{ color: "hsl(var(--primary-600))" }}
                onClick={() => setOpen(false)}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/content/table-of-contents.tsx
git commit -m "feat: add TableOfContents with scroll-spy sidebar and inline variants"
```

---

### Task 5: ArticleHeader and ArticleFooter

**Files:**
- Create: `components/content/article-header.tsx`
- Create: `components/content/article-footer.tsx`

- [ ] **Step 1: Create ArticleHeader**

```tsx
// components/content/article-header.tsx
import { cn } from "@/lib/utils";

interface ArticleHeaderProps {
  title: string;
  date?: string | null;
  author?: string | null;
  tags?: string[];
  category?: string | null;
  section?: string | null;
  centered?: boolean;
}

export function ArticleHeader({
  title,
  date,
  author,
  tags,
  category,
  section,
  centered = false,
}: ArticleHeaderProps) {
  return (
    <header className={cn("mb-8", centered && "text-center")}>
      {tags && tags.length > 0 && (
        <div className={cn("flex gap-2 mb-3 flex-wrap", centered && "justify-center")}>
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-semibold px-2.5 py-0.5"
              style={{
                background: "hsl(var(--primary-10))",
                color: "hsl(var(--primary))",
                borderRadius: "var(--radius-pill)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      {category && (
        <span
          className="text-xs font-semibold px-2.5 py-0.5 mb-3 inline-block"
          style={{
            background: "hsl(var(--secondary) / 0.15)",
            color: "hsl(var(--secondary))",
            borderRadius: "var(--radius-pill)",
          }}
        >
          {category}
        </span>
      )}
      {section && (
        <p className="text-sm text-muted-foreground mb-2">
          {section}
        </p>
      )}
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 leading-tight">
        {title}
      </h1>
      {(date || author) && (
        <p className="text-sm text-muted-foreground">
          {[author, date].filter(Boolean).join(" · ")}
        </p>
      )}
    </header>
  );
}
```

- [ ] **Step 2: Create ArticleFooter**

```tsx
// components/content/article-footer.tsx
import Link from "next/link";

interface ArticleFooterProps {
  backHref: string;
  backLabel: string;
  isEmbedded?: boolean;
}

export function ArticleFooter({ backHref, backLabel, isEmbedded }: ArticleFooterProps) {
  if (isEmbedded) return null;

  return (
    <footer className="mt-12 pt-6 border-t border-border">
      <Link
        href={backHref}
        className="text-sm font-medium hover:underline"
        style={{ color: "hsl(var(--primary))" }}
      >
        ← {backLabel}
      </Link>
    </footer>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/content/article-header.tsx components/content/article-footer.tsx
git commit -m "feat: add ArticleHeader and ArticleFooter components"
```

---

### Task 6: ArticleLayout (Blog Detail)

**Files:**
- Create: `components/content/article-layout.tsx`
- Modify: `app/(site)/[lang]/blog/[slug]/page.tsx`

- [ ] **Step 1: Create ArticleLayout**

```tsx
// components/content/article-layout.tsx
interface ArticleLayoutProps {
  header: React.ReactNode;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export function ArticleLayout({ header, children, footer }: ArticleLayoutProps) {
  return (
    <div className="py-6 md:py-10 px-4 sm:px-6">
      <div className="mx-auto" style={{ maxWidth: "var(--content-width)" }}>
        {/* Mobile: no card. Tablet+: white card */}
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
```

- [ ] **Step 2: Refactor blog detail page**

Replace `app/(site)/[lang]/blog/[slug]/page.tsx`:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPost, getPosts } from "@/lib/content";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { ArticleLayout } from "@/components/content/article-layout";
import { ArticleHeader } from "@/components/content/article-header";
import { ArticleFooter } from "@/components/content/article-footer";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Unimind Blog`,
    description: post.body.slice(0, 160).replace(/[#*\n]/g, "").trim(),
    openGraph: {
      title: post.title,
      type: "article",
      publishedTime: post.date ?? undefined,
      authors: post.author ? [post.author] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const isDev = process.env.VERCEL_ENV !== "production";
  if (!isDev && post.status !== "published") notFound();

  return (
    <ArticleLayout
      header={
        <ArticleHeader
          title={post.title}
          date={post.date}
          author={post.author}
          tags={post.tags ?? undefined}
          centered
        />
      }
      footer={
        <ArticleFooter backHref={`/${lang}/blog`} backLabel="Back to Blog" />
      }
    >
      <MDXRemote source={post.body} components={mdxComponents} />
    </ArticleLayout>
  );
}
```

- [ ] **Step 3: Verify blog detail renders**

Run: `pnpm dev`, navigate to a blog post.
Expected: Centered layout in white card (desktop), full white (mobile), header with tags/title/meta, footer with back link.

- [ ] **Step 4: Commit**

```bash
git add components/content/article-layout.tsx app/\(site\)/\[lang\]/blog/\[slug\]/page.tsx
git commit -m "feat: add ArticleLayout, refactor blog detail page"
```

---

### Task 7: DocsLayout (Wiki/Handbook Detail)

**Files:**
- Create: `components/content/docs-layout.tsx`
- Modify: `app/(site)/[lang]/wiki/[slug]/page.tsx`
- Modify: `app/(site)/[lang]/handbook/[slug]/page.tsx`

- [ ] **Step 1: Create DocsLayout**

```tsx
// components/content/docs-layout.tsx
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
      <div className="mx-auto" style={{ maxWidth: "var(--content-wide)" }}>
        <div className="lg:flex lg:gap-6">
          {/* Main content */}
          <article className="flex-1 min-w-0 md:bg-card md:rounded-xl md:p-8" style={{ boxShadow: "var(--shadow-sm)" }}>
            {header}
            {/* Inline TOC for mobile/tablet */}
            <div className="lg:hidden">
              <InlineTableOfContents headings={headings} />
            </div>
            <div className="prose max-w-none leading-relaxed">
              {children}
            </div>
            {footer}
          </article>

          {/* Sidebar TOC for desktop */}
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
```

- [ ] **Step 2: Refactor wiki detail page**

Replace `app/(site)/[lang]/wiki/[slug]/page.tsx`:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getWikiArticle, getWikiArticles } from "@/lib/content";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { DocsLayout } from "@/components/content/docs-layout";
import { ArticleHeader } from "@/components/content/article-header";
import { ArticleFooter } from "@/components/content/article-footer";
import { extractHeadings } from "@/lib/headings";

export async function generateStaticParams() {
  const articles = await getWikiArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getWikiArticle(slug);
  if (!article) return {};
  return {
    title: `${article.title} — Unimind Wiki`,
    description: article.body.slice(0, 160).replace(/[#*\n]/g, "").trim(),
    openGraph: { title: article.title, type: "article" },
  };
}

export default async function WikiArticlePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const article = await getWikiArticle(slug);

  if (!article) notFound();

  const isDev = process.env.VERCEL_ENV !== "production";
  if (!isDev && article.status !== "published") notFound();

  const headings = extractHeadings(article.body);

  return (
    <DocsLayout
      headings={headings}
      header={
        <ArticleHeader
          title={article.title}
          category={article.category}
        />
      }
      footer={
        <ArticleFooter backHref={`/${lang}/wiki`} backLabel="Back to Wiki" />
      }
    >
      <MDXRemote source={article.body} components={mdxComponents} />
    </DocsLayout>
  );
}
```

- [ ] **Step 3: Refactor handbook detail page**

Replace `app/(site)/[lang]/handbook/[slug]/page.tsx`:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getHandbookEntry, getHandbookEntries } from "@/lib/content";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { DocsLayout } from "@/components/content/docs-layout";
import { ArticleHeader } from "@/components/content/article-header";
import { ArticleFooter } from "@/components/content/article-footer";
import { extractHeadings } from "@/lib/headings";

export async function generateStaticParams() {
  const entries = await getHandbookEntries();
  return entries.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getHandbookEntry(slug);
  if (!entry) return {};
  return {
    title: `${entry.title} — Unimind Handbook`,
    description: entry.body.slice(0, 160).replace(/[#*\n]/g, "").trim(),
    openGraph: { title: entry.title, type: "article" },
  };
}

export default async function HandbookEntryPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const entry = await getHandbookEntry(slug);

  if (!entry) notFound();

  const isDev = process.env.VERCEL_ENV !== "production";
  if (!isDev && entry.status !== "published") notFound();

  const headings = extractHeadings(entry.body);

  return (
    <DocsLayout
      headings={headings}
      header={
        <ArticleHeader
          title={entry.title}
          section={entry.section}
        />
      }
      footer={
        <ArticleFooter backHref={`/${lang}/handbook`} backLabel="Back to Handbook" />
      }
    >
      <MDXRemote source={entry.body} components={mdxComponents} />
    </DocsLayout>
  );
}
```

- [ ] **Step 4: Verify wiki and handbook detail pages**

Run: `pnpm dev`, navigate to wiki and handbook detail pages.
Expected: Content in white card with sidebar TOC on desktop. Inline collapsible TOC on mobile. Scroll-spy highlights active heading.

- [ ] **Step 5: Commit**

```bash
git add components/content/docs-layout.tsx app/\(site\)/\[lang\]/wiki/\[slug\]/page.tsx app/\(site\)/\[lang\]/handbook/\[slug\]/page.tsx
git commit -m "feat: add DocsLayout with TOC sidebar, refactor wiki/handbook detail pages"
```

---

### Task 8: ListFeed Components

**Files:**
- Create: `components/content/list-feed-item.tsx`
- Create: `components/content/list-feed.tsx`

- [ ] **Step 1: Create ListFeedItem**

```tsx
// components/content/list-feed-item.tsx
import Link from "next/link";

interface ListFeedItemProps {
  href: string;
  title: string;
  meta?: string;
  tags?: string[];
  coverImage?: string | null;
  order?: number;
}

export function ListFeedItem({ href, title, meta, tags, coverImage, order }: ListFeedItemProps) {
  return (
    <Link
      href={href}
      className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border border-border md:border-0 md:bg-card transition-all"
      style={{
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {order != null && (
        <div
          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ background: "hsl(var(--primary-10))", color: "hsl(var(--primary))" }}
        >
          {order}
        </div>
      )}
      {coverImage && !order && (
        <div
          className="flex-shrink-0 w-13 h-10 sm:w-18 sm:h-13 lg:w-22 lg:h-16 rounded-md bg-cover bg-center"
          style={{
            backgroundImage: `url(${coverImage})`,
            background: coverImage ? undefined : "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-200)))",
          }}
        />
      )}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm sm:text-base font-semibold leading-snug mb-0.5 line-clamp-2">
          {title}
        </h3>
        {meta && (
          <p className="text-xs text-muted-foreground">{meta}</p>
        )}
        {tags && tags.length > 0 && (
          <div className="flex gap-1.5 mt-1.5 flex-wrap">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-semibold px-2 py-0.5"
                style={{
                  background: "hsl(var(--primary-10))",
                  color: "hsl(var(--primary))",
                  borderRadius: "var(--radius-pill)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Create ListFeed**

```tsx
// components/content/list-feed.tsx
import { ListFeedItem } from "@/components/content/list-feed-item";

interface FeedItem {
  slug: string;
  title: string;
  meta?: string;
  tags?: string[];
  coverImage?: string | null;
  group?: string;
  order?: number;
}

interface ListFeedProps {
  items: FeedItem[];
  basePath: string;
  groupBy?: boolean;
  emptyMessage?: string;
}

export function ListFeed({ items, basePath, groupBy, emptyMessage = "No content yet." }: ListFeedProps) {
  if (items.length === 0) {
    return <p className="text-muted-foreground">{emptyMessage}</p>;
  }

  if (groupBy) {
    const groups: Record<string, FeedItem[]> = {};
    for (const item of items) {
      const key = item.group || "General";
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    }

    return (
      <div className="space-y-8">
        {Object.entries(groups).map(([group, groupItems]) => (
          <div key={group}>
            <h2
              className="text-sm font-bold uppercase tracking-wide mb-3"
              style={{ color: "hsl(var(--primary))" }}
            >
              {group}
            </h2>
            <div className="flex flex-col gap-3">
              {groupItems.map((item) => (
                <ListFeedItem
                  key={item.slug}
                  href={`${basePath}/${item.slug}`}
                  title={item.title}
                  meta={item.meta}
                  tags={item.tags}
                  coverImage={item.coverImage}
                  order={item.order}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <ListFeedItem
          key={item.slug}
          href={`${basePath}/${item.slug}`}
          title={item.title}
          meta={item.meta}
          tags={item.tags}
          coverImage={item.coverImage}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/content/list-feed.tsx components/content/list-feed-item.tsx
git commit -m "feat: add ListFeed and ListFeedItem components"
```

---

### Task 9: Refactor Listing Pages

**Files:**
- Modify: `app/(site)/[lang]/blog/page.tsx`
- Modify: `app/(site)/[lang]/wiki/page.tsx`
- Modify: `app/(site)/[lang]/handbook/page.tsx`

- [ ] **Step 1: Refactor blog listing**

Replace `app/(site)/[lang]/blog/page.tsx`:

```tsx
import type { Metadata } from "next";
import { getPosts } from "@/lib/content";
import { ListFeed } from "@/components/content/list-feed";

export const metadata: Metadata = {
  title: "Blog — Unimind",
  description: "Latest articles and updates from Unimind.",
  openGraph: { title: "Unimind Blog" },
};

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const posts = await getPosts(lang);

  const items = posts.map((post) => ({
    slug: post.slug,
    title: post.entry.title,
    meta: [post.entry.author, post.entry.date].filter(Boolean).join(" · "),
    tags: post.entry.tags ?? undefined,
    coverImage: post.entry.coverImage ?? null,
  }));

  return (
    <div className="py-6 md:py-10 px-4 sm:px-6">
      <div className="mx-auto" style={{ maxWidth: "var(--content-wide)" }}>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Blog</h1>
        <p className="text-muted-foreground mb-8">Latest articles and updates</p>
        <ListFeed items={items} basePath={`/${lang}/blog`} emptyMessage="No posts published yet." />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Refactor wiki listing**

Replace `app/(site)/[lang]/wiki/page.tsx`:

```tsx
import type { Metadata } from "next";
import { getWikiArticles } from "@/lib/content";
import { ListFeed } from "@/components/content/list-feed";

export const metadata: Metadata = {
  title: "Wiki — Unimind",
  description: "Reference documentation and knowledge base.",
  openGraph: { title: "Unimind Wiki" },
};

export default async function WikiPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const articles = await getWikiArticles(lang);

  const items = articles.map((article) => ({
    slug: article.slug,
    title: article.entry.title,
    meta: article.entry.date ?? undefined,
    group: article.entry.category ?? undefined,
  }));

  return (
    <div className="py-6 md:py-10 px-4 sm:px-6">
      <div className="mx-auto" style={{ maxWidth: "var(--content-wide)" }}>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Wiki</h1>
        <p className="text-muted-foreground mb-8">Reference documentation and knowledge base</p>
        <ListFeed items={items} basePath={`/${lang}/wiki`} groupBy emptyMessage="No wiki articles yet." />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Refactor handbook listing**

Replace `app/(site)/[lang]/handbook/page.tsx`:

```tsx
import type { Metadata } from "next";
import { getHandbookEntries } from "@/lib/content";
import { ListFeed } from "@/components/content/list-feed";

export const metadata: Metadata = {
  title: "Handbook — Unimind",
  description: "Team guidelines, processes, and best practices.",
  openGraph: { title: "Unimind Handbook" },
};

export default async function HandbookPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const entries = await getHandbookEntries(lang);

  const items = entries.map((entry) => ({
    slug: entry.slug,
    title: entry.entry.title,
    group: entry.entry.section ?? undefined,
    order: entry.entry.order ?? undefined,
  }));

  return (
    <div className="py-6 md:py-10 px-4 sm:px-6">
      <div className="mx-auto" style={{ maxWidth: "var(--content-wide)" }}>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Handbook</h1>
        <p className="text-muted-foreground mb-8">Team guidelines, processes, and best practices</p>
        <ListFeed items={items} basePath={`/${lang}/handbook`} groupBy emptyMessage="No handbook entries yet." />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify all listing pages**

Run: `pnpm dev`, check `/en/blog`, `/en/wiki`, `/en/handbook`.
Expected: Individual cards per item. Wiki grouped by category. Handbook grouped by section with order numbers. Responsive across breakpoints.

- [ ] **Step 5: Commit**

```bash
git add app/\(site\)/\[lang\]/blog/page.tsx app/\(site\)/\[lang\]/wiki/page.tsx app/\(site\)/\[lang\]/handbook/page.tsx
git commit -m "feat: refactor listing pages to use ListFeed with individual cards"
```

---

### Task 10: Final Verification and Build

- [ ] **Step 1: Run lint**

Run: `pnpm lint`
Expected: No errors. Fix any that appear.

- [ ] **Step 2: Run production build**

Run: `pnpm build`
Expected: Build succeeds with no type errors.

- [ ] **Step 3: Test responsive behavior manually**

Check each of these in browser dev tools:
1. Blog detail at 375px (mobile) — full white, no card
2. Blog detail at 768px (tablet) — white card on gray
3. Blog detail at 1280px (desktop) — white card centered
4. Wiki detail at 1280px — content card + TOC card sidebar
5. Wiki detail at 375px — inline collapsible TOC
6. Blog listing at 375px — individual cards with border
7. Blog listing at 1280px — individual cards with shadow + hover
8. Add `?source=dokifree-app` to any page — no header/footer, full white

- [ ] **Step 4: Commit final fixes if any**

```bash
git add -A
git commit -m "fix: address lint and build issues from layout refactor"
```
