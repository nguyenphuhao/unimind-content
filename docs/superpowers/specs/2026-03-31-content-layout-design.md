# Content Layout Design Spec

Date: 2026-03-31
Status: Approved

## Overview

Redesign layout pages cho Blog, Wiki, Handbook — support Desktop Web, Mobile Browser, và Webview từ dokifree app. Modern, playful, dễ đọc, thoáng, follow design token chuẩn.

## Platforms

| Platform | Viewport | Behavior |
|---|---|---|
| Desktop Web | 1024px+ | Full layout, sticky header, sidebar TOC |
| Tablet | 768px - 1023px | White card content, inline TOC, full nav |
| Mobile Browser | < 768px | Full white immersive, hamburger menu, inline TOC |
| Webview (dokifree app) | Any | No header/footer, full white, reduced padding |

## Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Layout per content type | Each type has unique layout | Blog = reading, Wiki = reference, Handbook = sequential |
| Blog detail | Medium-like centered prose | Typography-focused, clean reading experience |
| Wiki/Handbook detail | Content + sidebar TOC | Desktop: sidebar right. Mobile: inline TOC above content |
| TOC sidebar style | White card | Matches content card pattern, clear contrast on gray bg |
| Listing pages | List/feed with individual cards | Each item = separate card, hover lift effect |
| Content background | White card on gray (desktop/tablet), full white (mobile) | Card elevation on larger screens, immersive on mobile |
| Webview detection | Query param + custom header | `?source=dokifree-app` primary, `X-Dokifree-App` fallback |
| Approach | Component-first (Approach A) | Reusable components, single source of truth |
| Design tokens | Refactor to standardized system | 4px spacing, type scale, layout tokens, motion, radius |

## 1. Design Tokens

Refactor `globals.css` into standardized token system. Remove dark mode variables (project is light-only).

### Spacing (4px-based)

```
--spacing-1: 4px     --spacing-2: 8px     --spacing-3: 12px
--spacing-4: 16px    --spacing-5: 20px    --spacing-6: 24px
--spacing-8: 32px    --spacing-10: 40px   --spacing-12: 48px
--spacing-16: 64px   --spacing-20: 80px   --spacing-24: 96px
```

### Typography

```
--text-xs: 12px      --text-sm: 14px      --text-base: 16px
--text-lg: 18px      --text-xl: 20px      --text-2xl: 24px
--text-3xl: 30px     --text-4xl: 36px

--leading-tight: 1.25     --leading-normal: 1.5     --leading-relaxed: 1.75
--font-normal: 400        --font-medium: 500
--font-semibold: 600      --font-bold: 700
```

### Layout

```
--content-width: 720px      (Blog prose column)
--content-wide: 1024px      (Listing pages, docs with sidebar)
--content-max: 1280px       (Full-width sections, landing pages)
--sidebar-width: 240px      (TOC sidebar)
--header-height: 64px
```

### Breakpoints (mobile-first)

```
--bp-sm: 640px       (large phones landscape)
--bp-md: 768px       (tablets, webview)
--bp-lg: 1024px      (small desktop, TOC sidebar appears)
--bp-xl: 1280px      (full desktop, max content width)
```

### Shadows

```
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05)       (cards, list items)
--shadow-md: 0 4px 12px rgba(0,0,0,0.08)       (hover states, dropdowns)
--shadow-lg: 0 8px 24px rgba(0,0,0,0.12)       (modals, popovers)
```

### Z-index

```
--z-base: 0          --z-dropdown: 10     --z-sticky: 20
--z-overlay: 30      --z-modal: 40        --z-toast: 50
```

### Motion (new)

```
--duration-fast: 150ms       --duration-normal: 250ms     --duration-slow: 350ms
--ease-default: cubic-bezier(0.4, 0, 0.2, 1)
```

### Border Radius (extend existing)

```
--radius: 0.75rem (12px)     --radius-sm: 8px     --radius-md: 10px
--radius-lg: 12px            --radius-pill: 100px  --radius-full: 9999px
```

### Colors

Keep existing color tokens (primary, secondary, grays, semantic). Remove `.dark` class and all dark mode variable overrides.

## 2. Component Architecture

### File Structure

```
components/
  layout/
    content-shell.tsx       # Wrapper: detect embedded, conditional header/footer
    site-header.tsx         # Header: logo, nav, lang switcher, mobile menu
    site-footer.tsx         # Footer: links, copyright
    mobile-nav.tsx          # Slide-out nav drawer for mobile
  content/
    article-layout.tsx      # Medium-like centered prose (Blog detail)
    docs-layout.tsx         # Content + sidebar TOC (Wiki/Handbook detail)
    list-feed.tsx           # Reusable list/feed for listing pages
    list-feed-item.tsx      # Single card in feed
    table-of-contents.tsx   # TOC: white card sidebar (desktop) + inline (mobile)
    article-header.tsx      # Title, author, date, tags, read time
    article-footer.tsx      # Related posts, share, back to list
  mdx/
    mdx-components.tsx      # Existing, enhance with new tokens
  language-switcher.tsx     # Existing, no change
```

### Route Usage

```
app/(site)/layout.tsx                     → ContentShell
app/(site)/[lang]/blog/page.tsx           → ListFeed
app/(site)/[lang]/blog/[slug]/page.tsx    → ArticleLayout
app/(site)/[lang]/wiki/page.tsx           → ListFeed (groupBy="category")
app/(site)/[lang]/wiki/[slug]/page.tsx    → DocsLayout
app/(site)/[lang]/handbook/page.tsx       → ListFeed (groupBy="section", showOrder)
app/(site)/[lang]/handbook/[slug]/page.tsx → DocsLayout
```

### ContentShell

Wrapper at `app/(site)/layout.tsx`. Detects embedded mode and conditionally renders header/footer.

Detection logic:
1. Check `searchParams.source === "dokifree-app"` (primary)
2. Check `headers().get("X-Dokifree-App") === "true"` (fallback)

When embedded:
- Hide SiteHeader + SiteFooter
- Full white background
- Padding: 12px
- Hide language switcher
- Hide "back to list" links

### ArticleLayout (Blog)

- max-width: 720px, centered
- Slots: header (ArticleHeader), children (MDX), footer (ArticleFooter)
- Desktop/Tablet: content inside white card (radius 12px, shadow-sm) on gray background
- Mobile: full white, no card, immersive reading
- Typography: leading-relaxed (1.75) for prose

### DocsLayout (Wiki, Handbook)

- max-width: 1024px
- Desktop (lg+): content in white card left + sticky TOC white card right (240px)
- Mobile/Tablet (< lg): inline TOC above content (collapsible)
- TOC sticky at top-80px (below header)
- Headings prop: extracted from MDX for TOC generation

### TableOfContents

Desktop (sidebar variant):
- White card (bg white, radius 12px, shadow-sm)
- Sticky position
- Items: padding 5px 10px, border-radius 6px
- Active item: primary-10 background, primary-500 text, font-weight 600
- Hover: gray-6 background
- Scroll-spy: highlight heading currently in viewport
- Support sub-items (h3 indented under h2)

Mobile (inline variant):
- Collapsible section above content
- primary-10 background, rounded
- Tap to expand/collapse

### ListFeed

Renders a list of content items as individual cards.

Props:
- `items: FeedItem[]` — content items to display
- `groupBy?: string` — optional field to group items (category, section)
- `showOrder?: boolean` — show numbered badges (handbook)
- `basePath: string` — link prefix (/en/blog, /vi/wiki...)

Card style:
- Individual white cards, each item separate
- Mobile: border style (1px solid gray-5), no shadow
- Desktop/Tablet: shadow-sm, hover: shadow-md + translateY(-1px)
- Layout: thumbnail left + info right (flex row)
- Thumbnail scales: 52x40 (mobile) → 72x52 (tablet) → 88x64 (desktop)

Blog listing: flat list, show tags + read time + excerpt (tablet+)
Wiki listing: grouped by category header, no thumbnails
Handbook listing: grouped by section header, numbered order badges

### ListFeedItem

Single card in feed. Renders:
- Cover image thumbnail (if available, graceful fallback)
- Title
- Metadata (author, date, read time / category / section)
- Tags (blog only)
- Excerpt (tablet+ only)
- Order badge (handbook only)

### ArticleHeader

- Tags (pill badges, primary-10 bg)
- Title (text-3xl desktop, text-2xl tablet, text-xl mobile)
- Author, date, read time metadata
- Blog: centered text on desktop
- Wiki/Handbook: left-aligned

### ArticleFooter

- Related posts (same content type, same locale)
- Back to list link (hidden in webview)
- Share buttons (optional, not in initial scope)

### SiteHeader

- Sticky top-0, z-sticky (20)
- Desktop/Tablet: logo + nav links (Blog, Wiki, Handbook) + language switcher
- Mobile: logo + hamburger → triggers MobileNav
- Hidden in webview mode

### MobileNav

- Slide-out drawer from left
- Semi-transparent overlay backdrop
- Nav links: Blog, Wiki, Handbook (active = primary color)
- Language switcher at bottom
- Close (X) button top-right
- Body scroll locked when open
- Animation: slide 250ms ease-out
- Hidden in webview mode

### SiteFooter

- Copyright, minimal links
- Hidden in webview mode

## 3. Responsive Behavior

### Mobile (< 768px)

- Background: full white (no gray bg, no card)
- Header: hamburger menu → MobileNav drawer
- Content: full-width, padding 16px
- TOC: inline, collapsible, above content
- Listing: individual cards with border (no shadow)
- Feed items: compact rows

### Tablet (768px - 1023px)

- Background: gray-6 with content in white cards
- Header: full nav visible, no hamburger
- Content: white card, centered, padding 24px
- TOC: inline (not enough room for sidebar)
- Listing: individual cards with shadow

### Desktop (1024px+)

- Background: gray-6 with content in white cards
- Header: sticky, full nav + lang switcher
- Blog: white card, max-width 720px, centered
- Wiki/Handbook: white card content left + white card TOC sidebar right
- Listing: individual cards, max-width 1024px, larger thumbnails, excerpts
- Hover effects on cards: shadow-md + translateY(-1px)

### Webview (dokifree app)

- Detect: `?source=dokifree-app` or `X-Dokifree-App: true` header
- Background: full white (same as mobile)
- Hide: SiteHeader, SiteFooter, language switcher, "back to list" links
- Padding: 12px
- TOC: inline only (no sidebar regardless of viewport)

## 4. Frontmatter

Keep existing schema. No new required fields. Optional fields render gracefully when missing:
- `coverImage`: show thumbnail in listing if present, skip if not
- All existing fields (title, locale, date, author, tags/category/section, status) unchanged

Content creators write plain markdown. Custom MDX components (Callout, Card) are optional.

## 5. Content Creation Workflow

Three paths, all unaffected by layout changes:
1. **Keystatic CMS** (`/adminx/`) — form with essential fields only
2. **AI Writer** (`/adminx/ai/`) — generate MDX automatically
3. **Local MDX + git push** — full control, can add optional frontmatter fields

Layout renders whatever frontmatter is present. Missing optional fields gracefully degrade.
