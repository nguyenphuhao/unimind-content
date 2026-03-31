# Unimind Content — Project Conventions

Content hub for Unimind — blog, wiki, handbook, and landing pages.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **CMS:** Keystatic (local file-based storage)
- **Styling:** Tailwind CSS 4 + shadcn/ui conventions
- **Content:** MDX with custom components (Callout, Card)
- **AI:** Anthropic SDK + Vercel AI SDK
- **Language:** TypeScript (strict mode)

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm format       # Format code with Prettier
pnpm format:check # Check formatting
```

## Project Structure

```
app/
  (site)/           # Public content routes
    [lang]/         # Locale prefix (en, vi)
      blog/         # Blog list + [slug]
      wiki/         # Wiki list + [slug]
      handbook/     # Handbook list + [slug]
      [slug]/       # Dynamic landing pages
  adminx/           # Keystatic admin + AI writer
  api/              # API routes (keystatic, ai)
components/
  ui/               # shadcn/ui primitives
  mdx/              # MDX rendering components
  *.tsx             # Domain-specific components
content/
  posts/            # Blog posts (MDX)
  wiki/             # Wiki articles (MDX)
  handbook/         # Handbook entries (MDX)
  pages/            # Landing pages (MDX)
lib/
  utils.ts          # cn() helper
  content.ts        # Keystatic reader + content fetchers
  ai.ts             # AI model configs, prompts, helpers
  i18n.ts           # Locale constants and helpers
middleware.ts       # Redirects / to /en/ (default locale)
public/
  images/           # Static images (posts cover images, etc.)
```

## Theme

Light mode only. Do not add dark mode, ThemeProvider, or theme toggle.

## Content Conventions

### Bilingual

Every content piece must have both EN and VI versions. Use the `locale` frontmatter field (`en` or `vi`). Slug convention: `<slug>` for EN, `<slug>-vi` for VI.

Routes are path-based: `/en/blog/my-post`, `/vi/blog/my-post-vi`. Middleware redirects `/blog` to `/en/blog`.

### Content Structure Templates

**Blog Post:**
1. Intro — hook + context (1-2 paragraphs)
2. Sections — 2-4 main points, each with its own heading
3. Key Takeaways — bullet list summarizing main points
4. Call to Action — what the reader should do next

**Wiki Article:**
1. Overview — 1 paragraph summary
2. Prerequisites — what the reader needs to know (if applicable)
3. Details — step-by-step or concept breakdown with subheadings
4. Related Topics — links to related wiki articles

**Handbook Entry:**
1. Purpose — why this entry exists (1-2 sentences)
2. Guidelines — specific rules/steps
3. Examples — concrete examples
4. Exceptions/Notes — edge cases, caveats

**Landing Page:**
1. Hero — headline + subtext
2. Problem/Value — what problem this solves
3. Features/Benefits — key selling points
4. CTA — call to action

### Frontmatter Fields

```yaml
# Blog Post
title: string
locale: "en" | "vi"
date: YYYY-MM-DD
author: string
tags: string[]
status: "draft" | "published"
coverImage: (optional)

# Wiki Article
title: string
locale: "en" | "vi"
date: YYYY-MM-DD
author: string
category: string
status: "draft" | "published"

# Handbook Entry
title: string
locale: "en" | "vi"
date: YYYY-MM-DD
author: string
section: string
order: number
status: "draft" | "published"

# Landing Page
title: string
locale: "en" | "vi"
description: string
status: "draft" | "published"
```

## Component Conventions

Follow shadcn/ui pattern:
- UI primitives go in `components/ui/`
- Domain components go in `components/`
- Use TypeScript with explicit props interface
- Use `cn()` from `lib/utils.ts` for className merging
- Named exports only (no default exports for components)
- Tailwind classes, no inline styles in new code

## Commit Style

```
content: <description>    # New or updated content
feat: <description>       # New feature
fix: <description>        # Bug fix
style: <description>      # UI/CSS changes
chore: <description>      # Tooling, config, dependencies
refactor: <description>   # Code restructuring
```

Keep messages concise. Lowercase first word after prefix.
