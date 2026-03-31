# Create Component

Create a new React component following shadcn/ui conventions.

## Process

1. Ask the user for:
   - **Component name:** PascalCase (e.g., `StatusBadge`)
   - **Type:** `ui` (primitive/reusable) or `domain` (feature-specific)
   - **Brief description:** what the component does

2. Determine file location:
   - UI primitive → `components/ui/<kebab-case>.tsx`
   - Domain component → `components/<kebab-case>.tsx`

3. Generate the component following the conventions below.

## Component Template

```tsx
import { cn } from "@/lib/utils";

interface <ComponentName>Props {
  // Define props here
  className?: string;
}

export function <ComponentName>({ className, ...props }: <ComponentName>Props) {
  return (
    <div className={cn("", className)}>
      {/* Component content */}
    </div>
  );
}
```

## Conventions

- **Named exports only** — no `export default`
- **Props interface** — always define explicitly, named `<ComponentName>Props`
- **`className` prop** — always accept and merge with `cn()`
- **Tailwind classes** — use Tailwind only, no inline styles
- **CSS variables** — use project theme tokens: `text-primary`, `bg-card`, `border-border`, etc.
- **No dark mode** — light mode only, do not add dark: variants
- **Semantic HTML** — use appropriate elements (button, nav, section, etc.)
- **Accessibility** — include aria labels where needed
- **File naming** — kebab-case for files (`status-badge.tsx`), PascalCase for components (`StatusBadge`)

## After Creation

- Confirm file path to the user
- Show a basic usage example
- If the component uses new design tokens not in `globals.css`, flag it
