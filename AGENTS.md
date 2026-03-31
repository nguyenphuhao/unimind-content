# Unimind Content

Read CONVENTIONS.md for full project conventions, structure, and content templates.

## Key Rules

- Light mode only — no dark mode, no ThemeProvider
- All content must be bilingual (EN + VI) — see CONVENTIONS.md for slug conventions
- Routes are path-based i18n: `/en/blog`, `/vi/blog` — always include `/{lang}/` prefix in links
- Components follow shadcn/ui pattern — named exports, `cn()` utility, TypeScript props interface
- Commit style: `content:`, `feat:`, `fix:`, `style:`, `chore:`, `refactor:` — lowercase after prefix

## Workflow: Creating Content

When asked to create new content (blog post, wiki article, handbook entry, or landing page):

1. Determine content type, title, and language
2. Create MDX file in the correct directory:
   - Blog → `content/posts/<slug>.mdx`
   - Wiki → `content/wiki/<slug>.mdx`
   - Handbook → `content/handbook/<slug>.mdx`
   - Landing page → `content/pages/<slug>.mdx`
3. Always create both EN and VI versions: `<slug>.mdx` (EN) and `<slug>-vi.mdx` (VI)
4. Set `status: draft` and `date` to today
5. Follow the structure template from CONVENTIONS.md for the content type:
   - Blog: Intro → Sections (2-4) → Key Takeaways → Call to Action
   - Wiki: Overview → Prerequisites → Details → Related Topics
   - Handbook: Purpose → Guidelines → Examples → Exceptions/Notes
   - Landing: Hero → Problem/Value → Features/Benefits → CTA

## Workflow: Reviewing Content

When asked to review content before publishing:

1. Check frontmatter is complete for the content type (see CONVENTIONS.md for required fields)
2. Verify structure matches the template for that content type
3. Check bilingual pair exists: EN file `<slug>.mdx` should have VI counterpart `<slug>-vi.mdx`
4. Look for placeholder text (`TODO`, `Lorem ipsum`, `<title>`, empty fields)
5. Verify heading hierarchy (h2 → h3, no skipping levels)
6. Report findings as a checklist per file with actionable recommendations

## Workflow: Creating Components

When asked to create a new React component:

1. Determine if it's a UI primitive (`components/ui/`) or domain component (`components/`)
2. File name: kebab-case (e.g., `status-badge.tsx`)
3. Use this pattern:

```tsx
import { cn } from "@/lib/utils";

interface ComponentNameProps {
  className?: string;
}

export function ComponentName({ className }: ComponentNameProps) {
  return <div className={cn("", className)} />;
}
```

4. Named export only, no `export default`
5. Always accept and merge `className` prop with `cn()`
6. Tailwind classes only, no inline styles
7. No `dark:` variants — light mode only
