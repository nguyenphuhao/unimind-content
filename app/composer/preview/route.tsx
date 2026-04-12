import { NextRequest, NextResponse } from "next/server";
import { renderToString } from "react-dom/server";
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx/mdx-components";

export async function POST(req: NextRequest) {
  let markdown: string;

  try {
    const body = await req.json();
    markdown = body.markdown || "";
  } catch {
    return new NextResponse("Invalid request", { status: 400 });
  }

  try {
    const element = await MDXRemote({
      source: markdown,
      components: mdxComponents,
    });

    const html = renderToString(element);

    const page = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=Nunito:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --background: 0 0% 100%;
      --foreground: 0 0% 9%;
      --primary: 221 83% 53%;
      --muted: 210 40% 96%;
      --muted-foreground: 215 16% 47%;
      --border: 214 32% 91%;
      --card: 0 0% 100%;
      --info: 217 91% 60%;
      --warning: 38 92% 50%;
      --success: 160 84% 39%;
      --destructive: 0 84% 60%;
      --gray-1: 210 40% 96%;
      --gray-6: 215 14% 34%;
    }
    body {
      font-family: 'Nunito', sans-serif;
      color: hsl(var(--foreground));
      background: hsl(var(--background));
      padding: 2rem;
      line-height: 1.7;
      max-width: 100%;
      overflow-x: hidden;
    }
    h1, h2, h3, h4, h5, h6 {
      font-family: 'Fraunces', serif;
    }
    img {
      max-width: 100%;
      height: auto;
      border-radius: 0.5rem;
    }
  </style>
</head>
<body>
  <article>${html}</article>
</body>
</html>`;

    return new NextResponse(page, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "MDX compilation error";
    const errorPage = `<!DOCTYPE html>
<html><body style="font-family:monospace;color:#dc2626;padding:2rem;">
<h3>Preview Error</h3>
<pre>${message}</pre>
</body></html>`;
    return new NextResponse(errorPage, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
}
