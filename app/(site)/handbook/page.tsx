import Link from "next/link";
import { getHandbookEntries } from "@/lib/content";

export default async function HandbookPage() {
  const entries = await getHandbookEntries();

  const grouped = entries.reduce(
    (acc, entry) => {
      const section = entry.entry.section || "General";
      if (!acc[section]) acc[section] = [];
      acc[section].push(entry);
      return acc;
    },
    {} as Record<string, typeof entries>
  );

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Handbook</h1>
      <p className="mb-8" style={{ color: "hsl(var(--muted-foreground))" }}>
        Team guidelines, processes, and best practices
      </p>

      {Object.keys(grouped).length === 0 ? (
        <p style={{ color: "hsl(var(--muted-foreground))" }}>
          No handbook entries yet.
        </p>
      ) : (
        Object.entries(grouped).map(([section, items]) => (
          <div key={section} className="mb-8">
            <h2
              className="text-lg font-semibold mb-3 pb-2 border-b"
              style={{ color: "hsl(var(--primary))" }}
            >
              {section}
            </h2>
            <div className="grid gap-3">
              {items.map((entry) => (
                <Link
                  key={entry.slug}
                  href={`/handbook/${entry.slug}`}
                  className="block p-4 rounded-lg border hover:border-primary transition-colors"
                  style={{ background: "hsl(var(--card))" }}
                >
                  <h3 className="font-medium">{entry.entry.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        ))
      )}
    </main>
  );
}
