"use client";

import { useCallback, useEffect, useState } from "react";
import { ContentList } from "./_components/content-list";
import { TopBar } from "./_components/top-bar";
import { EditorPanel } from "./_components/editor-panel";
import { PreviewPanel } from "./_components/preview-panel";
import { FrontmatterBar } from "./_components/frontmatter-bar";

type ContentType = "posts" | "wiki" | "handbook" | "pages";
type Language = "en" | "vi";
type View = "list" | "editor";

interface ContentItem {
  slug: string;
  collection: string;
  collectionLabel: string;
  title: string;
  locale: string;
  status: string;
  date: string;
}

interface FrontmatterData {
  title: string;
  author: string;
  date: string;
  status: string;
  tags: string;
  category: string;
  section: string;
  order: number;
  description: string;
  coverImage: string;
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function emptyFrontmatter(): FrontmatterData {
  return {
    title: "",
    author: "",
    date: todayISO(),
    status: "draft",
    tags: "",
    category: "",
    section: "",
    order: 0,
    description: "",
    coverImage: "",
  };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 64);
}

function buildMdxContent(
  contentType: ContentType,
  language: Language,
  frontmatter: FrontmatterData,
  body: string
): string {
  const fm: Record<string, unknown> = {
    title: frontmatter.title,
    locale: language,
    status: frontmatter.status,
  };

  if (contentType !== "pages") {
    fm.date = frontmatter.date;
    fm.author = frontmatter.author;
  }

  if (contentType === "posts") {
    fm.tags = frontmatter.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  if (contentType === "wiki") {
    fm.category = frontmatter.category;
  }
  if (contentType === "handbook") {
    fm.section = frontmatter.section;
    fm.order = frontmatter.order;
  }
  if (contentType === "pages") {
    fm.description = frontmatter.description;
  }

  const yamlLines = Object.entries(fm)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length === 0) return `${key}: []`;
        return `${key}:\n${value.map((v) => `  - "${v}"`).join("\n")}`;
      }
      if (typeof value === "number") return `${key}: ${value}`;
      return `${key}: "${value}"`;
    })
    .join("\n");

  return `---\n${yamlLines}\n---\n\n${body}`;
}

export default function ComposerPage() {
  const [view, setView] = useState<View>("list");
  const [items, setItems] = useState<ContentItem[]>([]);
  const [listLoading, setListLoading] = useState(true);

  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [contentType, setContentType] = useState<ContentType>("posts");
  const [language, setLanguage] = useState<Language>("en");
  const [frontmatter, setFrontmatter] = useState<FrontmatterData>(emptyFrontmatter());
  const [markdown, setMarkdown] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [editorKey, setEditorKey] = useState(0);

  const fetchList = useCallback(async () => {
    setListLoading(true);
    try {
      const res = await fetch("/api/composer/content");
      if (res.ok) {
        const data = await res.json();
        setItems(data as ContentItem[]);
      }
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  async function handleSelect(item: ContentItem) {
    const res = await fetch(
      `/api/composer/content?slug=${item.slug}&collection=${item.collection}`
    );
    if (!res.ok) return;

    const data = (await res.json()) as {
      slug: string;
      collection: string;
      frontmatter: Record<string, unknown>;
      body: string;
    };

    const fm = data.frontmatter;
    setEditingSlug(data.slug);
    setContentType(item.collection as ContentType);
    setLanguage((fm.locale as Language) || "en");
    setFrontmatter({
      title: (fm.title as string) || "",
      author: (fm.author as string) || "",
      date: (fm.date as string) || todayISO(),
      status: (fm.status as string) || "draft",
      tags: Array.isArray(fm.tags) ? fm.tags.join(", ") : "",
      category: (fm.category as string) || "",
      section: (fm.section as string) || "",
      order: typeof fm.order === "number" ? fm.order : 0,
      description: (fm.description as string) || "",
      coverImage: (fm.coverImage as string) || "",
    });
    setMarkdown(data.body);
    setEditorKey((k) => k + 1);
    setView("editor");
  }

  function handleNew() {
    setEditingSlug(null);
    setContentType("posts");
    setLanguage("en");
    setFrontmatter(emptyFrontmatter());
    setMarkdown("");
    setEditorKey((k) => k + 1);
    setView("editor");
  }

  function handleBack() {
    setView("list");
    fetchList();
  }

  async function handlePreview() {
    if (showPreview) {
      setShowPreview(false);
      return;
    }

    if (!frontmatter.title.trim()) {
      alert("Title is required to preview");
      return;
    }

    const slug =
      editingSlug ||
      slugify(frontmatter.title) + (language === "vi" ? "-vi" : "");

    const content = buildMdxContent(contentType, language, frontmatter, markdown);

    try {
      const res = await fetch("/api/composer/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          collection: contentType,
          content,
          language,
        }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      const { previewUrl: url } = (await res.json()) as { previewUrl: string };
      setPreviewUrl(url);
      setShowPreview(true);
    } catch (err) {
      alert(
        `Preview failed: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }
  }

  function getSlug(): string {
    return (
      editingSlug ||
      slugify(frontmatter.title) + (language === "vi" ? "-vi" : "")
    );
  }

  async function handleSaveDraft() {
    if (!frontmatter.title.trim()) {
      alert("Title is required");
      return;
    }

    setSaving(true);
    try {
      const slug = getSlug();
      const draftFm = { ...frontmatter, status: "draft" };
      const content = buildMdxContent(contentType, language, draftFm, markdown);

      const res = await fetch("/api/composer/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          collection: contentType,
          content,
          title: frontmatter.title,
        }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      setEditingSlug(slug);
      setFrontmatter(draftFm);
      alert("Draft saved and pushed!");
    } catch (err) {
      alert(
        `Save failed: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    if (!frontmatter.title.trim()) {
      alert("Title is required");
      return;
    }

    setPublishing(true);
    try {
      const slug = getSlug();
      const publishedFm = { ...frontmatter, status: "published" };
      const content = buildMdxContent(contentType, language, publishedFm, markdown);

      const res = await fetch("/api/composer/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          collection: contentType,
          content,
          title: frontmatter.title,
        }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      setEditingSlug(slug);
      setFrontmatter(publishedFm);
      alert("Published successfully!");
    } catch (err) {
      alert(
        `Publish failed: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    } finally {
      setPublishing(false);
    }
  }

  if (view === "list") {
    return (
      <ContentList
        items={items}
        loading={listLoading}
        onSelect={handleSelect}
        onNew={handleNew}
      />
    );
  }

  return (
    <div className="h-screen flex flex-col" style={{ background: "hsl(var(--background))" }}>
      <TopBar
        contentType={contentType}
        language={language}
        showPreview={showPreview}
        publishing={publishing}
        saving={saving}
        onContentTypeChange={setContentType}
        onLanguageChange={setLanguage}
        onTogglePreview={handlePreview}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        onBack={handleBack}
      />

      <div className="flex-1 flex min-h-0">
        <EditorPanel
          key={editorKey}
          initialValue={markdown}
          collection={contentType}
          onChange={setMarkdown}
        />
        {showPreview && previewUrl && <PreviewPanel previewUrl={previewUrl} />}
      </div>

      <FrontmatterBar
        contentType={contentType}
        data={frontmatter}
        onChange={setFrontmatter}
      />
    </div>
  );
}
