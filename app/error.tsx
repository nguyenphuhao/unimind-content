"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <h1
          className="text-6xl font-bold mb-4"
          style={{ color: "hsl(var(--destructive))" }}
        >
          Error
        </h1>
        <p
          className="text-xl mb-6"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          Something went wrong
        </p>
        <button
          onClick={reset}
          className="inline-block px-6 py-3 rounded-lg font-medium transition-opacity hover:opacity-90"
          style={{
            background: "hsl(var(--primary))",
            color: "hsl(var(--primary-foreground))",
          }}
        >
          Try Again
        </button>
      </div>
    </main>
  );
}
