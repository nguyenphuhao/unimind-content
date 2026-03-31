import React from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MDXComponents = Record<string, React.ComponentType<any>>;

function Callout({
  children,
  type = "info",
}: {
  children: React.ReactNode;
  type?: "info" | "warning" | "error" | "success";
}) {
  const styles = {
    info: {
      border: "1px solid hsl(var(--info))",
      background: "hsl(var(--info) / 0.1)",
      borderLeft: "4px solid hsl(var(--info))",
    },
    warning: {
      border: "1px solid hsl(var(--warning))",
      background: "hsl(var(--warning) / 0.1)",
      borderLeft: "4px solid hsl(var(--warning))",
    },
    error: {
      border: "1px solid hsl(var(--destructive))",
      background: "hsl(var(--destructive) / 0.1)",
      borderLeft: "4px solid hsl(var(--destructive))",
    },
    success: {
      border: "1px solid hsl(var(--success))",
      background: "hsl(var(--success) / 0.1)",
      borderLeft: "4px solid hsl(var(--success))",
    },
  };

  return (
    <div
      style={{ ...styles[type], borderRadius: "0.5rem", padding: "1rem" }}
      className="my-4"
    >
      {children}
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="my-4 rounded-lg border p-5"
      style={{ background: "hsl(var(--card))" }}
    >
      {title && <h3 className="font-semibold mb-2">{title}</h3>}
      {children}
    </div>
  );
}

export const mdxComponents: MDXComponents = {
  Callout,
  Card,
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold mt-8 mb-4 font-display">{children}</h1>
  ),
  h2: ({ children }) => {
    const id = String(children)
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    return (
      <h2 id={id} className="text-2xl font-semibold mt-8 mb-3 scroll-mt-20 font-display">
        {children}
      </h2>
    );
  },
  h3: ({ children }) => {
    const id = String(children)
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    return (
      <h3 id={id} className="text-xl font-semibold mt-6 mb-2 scroll-mt-20 font-display">
        {children}
      </h3>
    );
  },
  p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
  ul: ({ children }) => (
    <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote
      className="border-l-4 pl-4 my-4 italic"
      style={{
        borderColor: "hsl(var(--primary))",
        color: "hsl(var(--muted-foreground))",
      }}
    >
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code
      className="px-1.5 py-0.5 rounded text-sm font-mono"
      style={{
        background: "hsl(var(--muted))",
        color: "hsl(var(--primary))",
      }}
    >
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre
      className="rounded-lg p-4 overflow-x-auto my-4 text-sm"
      style={{ background: "hsl(var(--gray-1))", color: "hsl(var(--gray-6))" }}
    >
      {children}
    </pre>
  ),
  hr: () => (
    <hr className="my-6" style={{ borderColor: "hsl(var(--border))" }} />
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="underline underline-offset-2 hover:opacity-70"
      style={{ color: "hsl(var(--primary))" }}
    >
      {children}
    </a>
  ),
};
