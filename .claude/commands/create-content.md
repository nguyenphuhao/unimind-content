# Create Content

Create a new MDX content file for Unimind with the correct structure and frontmatter.

## Process

1. Ask the user for:
   - **Content type:** blog | wiki | handbook | page
   - **Title:** in the primary language
   - **Language:** which to write first (en or vi) — both versions will be created

2. Generate the MDX file following the structure template below. Set `status: draft` and `date` to today.

3. Create **both language versions** (EN + VI) with the same slug but different `locale` field.

4. Write files to the correct directory:
   - blog → `content/posts/<slug>.mdx` (but since both share a slug, use slug suffix: `<slug>` for primary, create a second file or note to user about bilingual approach)
   - wiki → `content/wiki/<slug>.mdx`
   - handbook → `content/handbook/<slug>.mdx`
   - page → `content/pages/<slug>.mdx`

**Important:** Since Keystatic uses `locale` field (not path-based i18n), each language version is a separate file with a distinct slug. Use convention: `<slug>` for EN, `<slug>-vi` for VI.

## Structure Templates

### Blog Post
```mdx
---
title: <title>
locale: en|vi
date: YYYY-MM-DD
author: ""
tags: []
status: draft
---

<!-- Intro: hook + context (1-2 paragraphs) -->

## <Section 1 Heading>
<!-- Main point with supporting details -->

## <Section 2 Heading>
<!-- Main point with supporting details -->

## Key Takeaways
- Point 1
- Point 2
- Point 3

## Next Steps
<!-- Call to action: what should the reader do next? -->
```

### Wiki Article
```mdx
---
title: <title>
locale: en|vi
date: YYYY-MM-DD
author: ""
category: ""
status: draft
---

<!-- Overview: 1 paragraph summary of what this article covers -->

## Prerequisites
<!-- What the reader needs to know before reading (omit if none) -->

## <Detail Section 1>
<!-- Step-by-step or concept breakdown -->

## <Detail Section 2>
<!-- Continue breakdown with subheadings as needed -->

## Related Topics
- [[Link to related wiki article]]
```

### Handbook Entry
```mdx
---
title: <title>
locale: en|vi
date: YYYY-MM-DD
author: ""
section: ""
order: 0
status: draft
---

## Purpose
<!-- Why this entry exists (1-2 sentences) -->

## Guidelines
<!-- Specific rules or steps to follow -->
1. Step one
2. Step two

## Examples
<!-- Concrete examples demonstrating the guidelines -->

## Notes
<!-- Edge cases, exceptions, caveats -->
```

### Landing Page
```mdx
---
title: <title>
locale: en|vi
description: ""
status: draft
---

<!-- Hero: headline + subtext -->

## The Problem
<!-- What problem does this solve? -->

## Features
<!-- Key selling points / benefits -->

## Get Started
<!-- Call to action -->
```

## After Creation

- Confirm file paths to the user
- Remind them to fill in `author`, `tags`/`category`/`section` fields
- Remind them to review and publish via Keystatic UI or by changing `status: published`
