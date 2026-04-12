"use client";

import { useEffect, useRef } from "react";
import { Editor, rootCtx, defaultValueCtx } from "@milkdown/kit/core";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import { history } from "@milkdown/kit/plugin/history";
import { clipboard } from "@milkdown/kit/plugin/clipboard";
import { listener, listenerCtx } from "@milkdown/kit/plugin/listener";
import { upload, uploadConfig, type Uploader } from "@milkdown/plugin-upload";

import "@milkdown/kit/prose/view/style/prosemirror.css";
import "@milkdown/kit/prose/gapcursor/style/gapcursor.css";
import "@milkdown/kit/prose/tables/style/tables.css";

interface EditorPanelProps {
  initialValue: string;
  collection: string;
  onChange: (markdown: string) => void;
}

export function EditorPanel({
  initialValue,
  collection,
  onChange,
}: EditorPanelProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstance = useRef<Editor | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const el = editorRef.current;

    Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, el);
        ctx.set(defaultValueCtx, initialValue);

        ctx.get(listenerCtx).markdownUpdated((_ctx, markdown) => {
          onChange(markdown);
        });

        const uploader: Uploader = async (files, schema) => {
          const images: Array<{ src: string; alt: string }> = [];

          for (const file of Array.from(files)) {
            if (!file.type.startsWith("image/")) continue;

            const formData = new FormData();
            formData.append("file", file);
            formData.append("collection", collection);

            const res = await fetch("/api/composer/images", {
              method: "POST",
              body: formData,
            });

            if (res.ok) {
              const { url } = (await res.json()) as { url: string };
              images.push({ src: url, alt: file.name });
            }
          }

          const imageNodeType = schema.nodes.image;
          return images.map(({ src, alt }) =>
            imageNodeType.create({ src, alt })
          );
        };

        ctx.update(uploadConfig.key, (prev) => ({
          ...prev,
          uploader,
        }));
      })
      .use(commonmark)
      .use(history)
      .use(clipboard)
      .use(listener)
      .use(upload)
      .create()
      .then((editor) => {
        editorInstance.current = editor;
      });

    return () => {
      editorInstance.current?.destroy();
      editorInstance.current = null;
    };
    // Only run on mount — initialValue changes are handled by the parent remounting with a key
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex-1 overflow-auto" style={{ background: "hsl(var(--background))" }}>
      <div
        ref={editorRef}
        className="h-full p-4 prose prose-sm max-w-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-full"
        style={{
          fontFamily: "'Nunito', sans-serif",
          color: "hsl(var(--foreground))",
        }}
      />
    </div>
  );
}
