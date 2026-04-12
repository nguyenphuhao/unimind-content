# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Read CONVENTIONS.md for full project conventions, content templates, and frontmatter schemas.

## Commands

```bash
pnpm dev          # Start dev server (Next.js 16)
pnpm build        # Production build
pnpm lint         # ESLint
pnpm format       # Prettier write
pnpm format:check # Prettier check
```

No test runner is configured. Verify changes with `pnpm build` and `pnpm lint`.

## Architecture

Next.js 16 App Router content platform with Keystatic CMS, AI-powered content generation, and bilingual (EN/VI) support.

### Route Groups

- `app/(site)/[lang]/` — public content routes, locale-prefixed (`en`, `vi`)
- `app/adminx/` — Keystatic admin UI + AI writer
- `app/api/` — API routes (keystatic, AI generation)

Middleware (`middleware.ts`) enforces `/[lang]/` prefix on all public routes, redirecting `/` to `/en/`. Routes under `/api/`, `/keystatic/`, `/adminx/` bypass locale redirect.

### Content Pipeline

1. **Keystatic config** (`keystatic.config.tsx`) defines 4 collections: posts, wiki, handbook, pages — each stored as MDX in `content/`
2. **Content reader** (`lib/content.ts`) uses `createReader()` + `gray-matter` to extract frontmatter and raw MDX body. Filters by locale and status (drafts visible in dev only, via `VERCEL_ENV`)
3. **MDX rendering** (`components/mdx/mdx-components.tsx`) uses `next-mdx-remote` RSC mode with custom components: `<Callout>` (info/warning/success/error) and `<Card>`
4. **Layouts** — `DocsLayout` provides two-column layout with TOC sidebar; `ContentShell` wraps doc + sidebar

### AI Writer

- `/api/ai` (POST) — streaming preview via Vercel AI SDK
- `/api/ai/create` (POST) — generates full MDX, commits to GitHub, redirects to Keystatic editor
- `lib/ai.ts` — model configs (GPT-5, GPT-4o, Claude Opus/Sonnet via gateway), prompt templates per content type/language
- UI at `/adminx/ai/` — client component with live streaming preview

### Key Files

- `middleware.ts` — locale routing enforcement
- `keystatic.config.tsx` — collection schemas and MDX component definitions
- `lib/content.ts` — data fetching, locale/status filtering
- `lib/ai.ts` — AI models, prompts, GitHub commit paths
- `lib/i18n.ts` — locale constants and helpers
- `lib/utils.ts` — `cn()` className merge helper

## Conventions

- **Light mode only** — no dark mode, ThemeProvider, or theme toggle
- **Named exports only** for components (no default exports)
- **shadcn/ui pattern** — UI primitives in `components/ui/`, domain components in `components/`
- **Bilingual content** — every piece needs EN and VI versions. Slug: `<slug>` for EN, `<slug>-vi` for VI
- **Fonts** — Fraunces for article titles, Nunito as body font
- **CSS vars** — HSL design tokens (--primary, --border, --card, etc.)

## Commit Style

```
content: <description>    # New or updated content
feat: <description>       # New feature
fix: <description>        # Bug fix
style: <description>      # UI/CSS changes
chore: <description>      # Tooling, config, dependencies
refactor: <description>   # Code restructuring
```

## Claude-Specific

Custom slash commands in `.claude/commands/`:
- `/create-content` — scaffold new MDX content (blog/wiki/handbook/page) with bilingual support
- `/review-content` — review content before publishing (frontmatter, structure, i18n, quality)
- `/create-component` — scaffold new React component (shadcn/ui convention)
