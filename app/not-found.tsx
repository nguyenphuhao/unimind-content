import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4" style={{ color: "hsl(var(--primary))" }}>
          404
        </h1>
        <p className="text-xl mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>
          Page not found
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-lg font-medium transition-opacity hover:opacity-90"
          style={{
            background: "hsl(var(--primary))",
            color: "hsl(var(--primary-foreground))",
          }}
        >
          Go Home
        </Link>
      </div>
    </main>
  );
}
