"use client";

import { useEffect, useRef } from "react";
import { Editor, rootCtx, defaultValueCtx } from "@milkdown/kit/core";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import { history } from "@milkdown/kit/plugin/history";
import { clipboard } from "@milkdown/kit/plugin/clipboard";
import { listener, listenerCtx } from "@milkdown/kit/plugin/listener";
import { upload, uploadConfig } from "@milkdown/plugin-upload";

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

        ctx.update(uploadConfig.key, (prev) => ({
          ...prev,
          uploader: async (files: FileList, schema: unknown) => {
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

            const imageSchema =
              schema && typeof schema === "object" && "nodes" in schema
                ? (schema as { nodes: { get: (name: string) => { create: (attrs: { src: string; alt: string }) => unknown } } })
                : null;
            const imageNodeType = imageSchema?.nodes?.get("image");

            return images.map(({ src, alt }) =>
              imageNodeType
                ? imageNodeType.create({ src, alt })
                : null
            ).filter(Boolean);
          },
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
    <div className="flex-1 overflow-auto">
      <div
        ref={editorRef}
        className="h-full p-4 prose prose-sm max-w-none"
        style={{
          fontFamily: "'Nunito', sans-serif",
          color: "hsl(var(--foreground))",
        }}
      />
    </div>
  );
}
