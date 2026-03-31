# Review Content

Review content files before publishing. Can review a specific file or all draft content.

## Process

1. **Identify target:** Ask the user which content to review, or scan `content/` for all files with `status: draft`.

2. **Run checks** on each file:

### Frontmatter Check
- All required fields present and non-empty for the content type:
  - Blog: title, locale, date, author, tags, status
  - Wiki: title, locale, date, author, category, status
  - Handbook: title, locale, date, author, section, order, status
  - Page: title, locale, description, status
- `locale` is exactly `en` or `vi`
- `date` is valid format (YYYY-MM-DD)
- `status` is `draft` or `published`

### Structure Check
Verify content follows the required template:

- **Blog:** Has intro paragraph → section headings → Key Takeaways → Next Steps/CTA
- **Wiki:** Has overview paragraph → Prerequisites (if needed) → Detail sections → Related Topics
- **Handbook:** Has Purpose → Guidelines → Examples → Notes
- **Page:** Has hero text → Problem/Value → Features → CTA

Flag missing sections.

### Bilingual Check
- For each content file, check if the corresponding language version exists
- EN file `<slug>.mdx` should have a VI counterpart `<slug>-vi.mdx` (and vice versa)
- Flag any orphaned single-language content

### Quality Check
- Spelling and grammar issues
- Tone: professional but approachable
- Headings are descriptive (not generic like "Section 1")
- No placeholder text left (e.g., `<title>`, `Lorem ipsum`, `TODO`)
- Links are valid (not broken markdown links)
- Code blocks have language specified
- Images have alt text

### SEO Check
- Title is descriptive and under 60 characters
- First paragraph works as a meta description
- Headings use proper hierarchy (h2 → h3, no skipping)
- Content has sufficient length (blog: 300+ words, wiki: 200+ words)

## Output Format

Present results as a checklist per file:

```
## <filename>
- [x] Frontmatter complete
- [ ] Missing `author` field
- [x] Structure follows template
- [ ] Bilingual: VI version missing
- [x] No placeholder text
- [ ] SEO: title too long (72 chars)
```

Then provide a summary with actionable recommendations.
