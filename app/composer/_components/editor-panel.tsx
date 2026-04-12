"use client";

import { useEffect, useRef } from "react";
import { Crepe, CrepeFeature } from "@milkdown/crepe";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/classic.css";

interface EditorPanelProps {
  initialValue: string;
  collection: string;
  onChange: (markdown: string) => void;
}

async function uploadImage(file: File, collection: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("collection", collection);

  const res = await fetch("/api/composer/images", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Upload failed");
  const { url } = (await res.json()) as { url: string };
  return url;
}

export function EditorPanel({
  initialValue,
  collection,
  onChange,
}: EditorPanelProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const crepeRef = useRef<Crepe | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const crepe = new Crepe({
      root: editorRef.current,
      defaultValue: initialValue,
      featureConfigs: {
        [CrepeFeature.ImageBlock]: {
          onUpload: (file: File) => uploadImage(file, collection),
        },
        [CrepeFeature.Placeholder]: {
          text: "Start writing...",
        },
      },
    });

    crepe.on((listener) => {
      listener.markdownUpdated((_ctx, markdown) => {
        onChange(markdown);
      });
    });

    crepe.create().then(() => {
      crepeRef.current = crepe;
    });

    return () => {
      crepeRef.current?.destroy();
      crepeRef.current = null;
    };
    // Only run on mount — parent remounts with key prop to switch content
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: "hsl(var(--background))" }}>
      <div
        ref={editorRef}
        className="flex-1 overflow-auto"
      />
    </div>
  );
}
