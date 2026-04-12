# Composer — Design Spec

Content editor tích hợp vào Next.js app, thay thế Keystatic UI. Sử dụng Milkdown editor với split view layout và live preview render bằng đúng MDX pipeline của site.

## Decisions

- **Thay thế Keystatic UI** — Composer là editor chính, Keystatic admin routes (`/adminx`) sẽ bị remove
- **Tích hợp vào Next.js app** — route mới trong app, dùng chung MDX rendering pipeline để preview chuẩn
- **Milkdown** (MIT) — WYSIWYG markdown editor, plugin-based, hỗ trợ drag-drop image
- **Split view** — editor trái, live preview phải
- **Publish = commit + push main** — không tạo PR, không review step
- **Images** — lưu vào `public/images/<collection>/` theo convention hiện tại

## Route Structure

```
app/
  composer/
    page.tsx            # Main composer page (client component)
    layout.tsx          # Composer layout (no site header/footer)
  api/
    composer/
      images/route.ts   # POST — handle image upload
      publish/route.ts  # POST — commit + push to GitHub
      content/route.ts  # GET — list content, GET by slug — read content
```

Composer chạy tại `/composer`. Không dùng locale prefix vì đây là tool nội bộ, không phải public content. Middleware cần exclude `/composer` khỏi locale redirect (tương tự `/adminx`, `/api`).

## UI Layout

```
┌──────────────────────────────────────────────────────────┐
│  Composer          [Content Type ▼] [Lang ▼]   Preview  Publish │
├────────────────────────────┬─────────────────────────────┤
│                            │                             │
│  Milkdown Editor           │  Live Preview               │
│  (WYSIWYG markdown)       │  (MDX pipeline render)      │
│                            │                             │
│  - Toolbar (B/I/U/H/...)  │  - Fraunces + Nunito fonts  │
│  - Drag-drop images       │  - Callout, Card components │
│  - Callout/Card insertion │  - DocsLayout styling       │
│                            │                             │
├────────────────────────────┴─────────────────────────────┤
│  Frontmatter Bar: Title | Author | Tags/Category | Date | Status │
└──────────────────────────────────────────────────────────┘
```

### Top Bar
- Logo/title: "Composer"
- Content type selector: Blog / Wiki / Handbook / Page
- Language selector: EN / VI
- Preview button: toggle preview panel on/off (default: on)
- Publish button: commit + push

### Editor Panel (left)
- Milkdown WYSIWYG editor
- Toolbar: bold, italic, headings, lists, links, code, blockquote
- Custom toolbar buttons: insert `<Callout>`, insert `<Card>`
- Drag-drop image upload: drops image into `public/images/<collection>/`, inserts markdown image reference
- Paste image from clipboard: same flow as drag-drop

### Preview Panel (right)
- Renders editor content using `MDXRemote` from `next-mdx-remote`
- Uses same custom components (`Callout`, `Card`) from `components/mdx/mdx-components.tsx`
- Applies site CSS/design tokens (Fraunces headings, Nunito body, HSL vars)
- Updates on editor content change (debounced ~300ms)

### Frontmatter Bar (bottom)
- Form fields matching Keystatic schema per content type:
  - Blog: title, author, tags, date, status, coverImage
  - Wiki: title, author, category, date, status
  - Handbook: title, author, section, order, date, status
  - Page: title, description, status
- Locale is set via the language selector in top bar
- Date defaults to today

## Opening Flow

### Landing state
Khi mở `/composer`:
1. Fetch danh sách tất cả content từ `content/` (posts, wiki, handbook, pages)
2. Hiển thị list view với:
   - Content title
   - Type badge (Blog / Wiki / Handbook / Page)
   - Locale badge (EN / VI)
   - Status badge (Draft / Published)
   - Last modified date
3. Click vào item → load content vào editor
4. "New" button → blank editor, chọn content type + language

### Edit existing content
- Đọc MDX file từ `content/<collection>/<slug>.mdx`
- Parse frontmatter → fill vào frontmatter bar
- Parse body → load vào Milkdown editor
- Preview panel render ngay

## Image Upload Flow

1. User drag-drop (hoặc paste) image vào editor
2. Client POST image to `/api/composer/images` với `collection` param
3. API route:
   - Nhận file upload
   - Generate filename: `<timestamp>-<original-name>` (tránh trùng)
   - Lưu vào `public/images/<collection>/`
   - Return path: `/images/<collection>/<filename>`
4. Client insert markdown image: `![alt](/images/<collection>/<filename>)`
5. Preview panel render image ngay (Next.js serve từ `public/`)

## Publish Flow

1. User click "Publish"
2. Client thu thập:
   - Frontmatter fields từ form
   - Markdown content từ Milkdown
   - Assemble thành MDX file: YAML frontmatter + markdown body
3. POST to `/api/composer/publish` với:
   ```json
   {
     "slug": "my-post",
     "collection": "posts",
     "content": "---\ntitle: ...\n---\n\nBody content..."
   }
   ```
4. API route:
   - Ghi file vào `content/<collection>/<slug>.mdx`
   - `git add content/<collection>/<slug>.mdx` + bất kỳ images mới
   - `git commit -m "content: <title>"`
   - `git push origin main`
   - Return success/error
5. Client hiển thị success notification hoặc error message

### Slug handling
- Tạo mới: generate slug từ title bằng `slugify()` (đã có trong `lib/ai.ts`)
- Edit existing: giữ nguyên slug
- VI version: slug có suffix `-vi` theo convention

## Content API

### GET /api/composer/content
List tất cả content files.

Response:
```json
[
  {
    "slug": "hello-world",
    "collection": "posts",
    "title": "Hello World",
    "locale": "en",
    "status": "draft",
    "date": "2026-04-12"
  }
]
```

### GET /api/composer/content?slug=hello-world&collection=posts
Đọc một content file cụ thể.

Response:
```json
{
  "slug": "hello-world",
  "collection": "posts",
  "frontmatter": { "title": "Hello World", "locale": "en", ... },
  "body": "## Introduction\n\nLorem ipsum..."
}
```

## Dependencies

Thêm vào project:
- `@milkdown/kit` — core editor + common plugins (toolbar, history, clipboard, etc.)
- `@milkdown/plugin-upload` — drag-drop image upload support

## Files to Create

```
app/composer/page.tsx          # Main composer client component
app/composer/layout.tsx        # Minimal layout (no site header/footer)
app/api/composer/content/route.ts   # Content list + read API
app/api/composer/images/route.ts    # Image upload API
app/api/composer/publish/route.ts   # Commit + push API
```

## Files to Modify

- `middleware.ts` — exclude `/composer` từ locale redirect
- `package.json` — thêm Milkdown dependencies

## Files to Remove

- `app/adminx/page.tsx`, `app/adminx/layout.tsx` — Keystatic admin UI (thay thế bởi Composer)
- Giữ nguyên `app/adminx/ai/` — AI writer vẫn hoạt động độc lập, migrate sau
- Keystatic dependencies trong `package.json` (`@keystatic/core`, `@keystatic/next`) — remove sau khi Composer stable, không remove ngay

## Out of Scope

- AI content generation (giữ nguyên `/adminx/ai/` hoặc migrate sau)
- Image optimization/resize khi upload
- Collaborative editing
- Version history / undo beyond editor session
- Dark mode
