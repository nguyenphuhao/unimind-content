"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { Heading } from "@/lib/headings";

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px" }
    );

    for (const heading of headings) {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="text-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
        On this page
      </p>
      <ul className="space-y-0.5">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={cn(
                "block py-1.5 px-3 rounded-md transition-colors",
                heading.level === 3 && "pl-6",
                activeId === heading.id
                  ? "font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
              style={
                activeId === heading.id
                  ? { background: "hsl(var(--primary-10))", color: "hsl(var(--primary))" }
                  : undefined
              }
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function InlineTableOfContents({ headings }: TableOfContentsProps) {
  const [open, setOpen] = useState(false);

  if (headings.length === 0) return null;

  return (
    <div
      className="rounded-lg mb-6"
      style={{ background: "hsl(var(--primary-10))" }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-3 text-sm font-semibold"
        style={{ color: "hsl(var(--primary-600))" }}
      >
        <span className="text-xs uppercase tracking-wide">Table of Contents</span>
        <span className="text-xs">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <ul className="px-3 pb-3 space-y-1">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={cn(
                  "block py-1 text-sm",
                  heading.level === 3 && "pl-4"
                )}
                style={{ color: "hsl(var(--primary-600))" }}
                onClick={() => setOpen(false)}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
