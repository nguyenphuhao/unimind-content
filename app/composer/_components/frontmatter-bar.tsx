"use client";

type ContentType = "posts" | "wiki" | "handbook" | "pages";

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

interface FrontmatterBarProps {
  contentType: ContentType;
  data: FrontmatterData;
  onChange: (data: FrontmatterData) => void;
}

const inputStyle = {
  background: "hsl(var(--input, var(--muted)))",
  borderColor: "hsl(var(--border))",
  color: "hsl(var(--foreground))",
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label
        className="text-xs font-medium"
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

export function FrontmatterBar({
  contentType,
  data,
  onChange,
}: FrontmatterBarProps) {
  function update(field: keyof FrontmatterData, value: string | number) {
    onChange({ ...data, [field]: value });
  }

  return (
    <div
      className="border-t px-4 py-3 shrink-0"
      style={{
        background: "hsl(var(--card))",
        borderColor: "hsl(var(--border))",
      }}
    >
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px]">
          <Field label="Title">
            <input
              type="text"
              value={data.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="Content title"
              className="w-full rounded border px-2 py-1 text-sm"
              style={inputStyle}
            />
          </Field>
        </div>

        {contentType !== "pages" && (
          <div className="w-[150px]">
            <Field label="Author">
              <input
                type="text"
                value={data.author}
                onChange={(e) => update("author", e.target.value)}
                placeholder="Author name"
                className="w-full rounded border px-2 py-1 text-sm"
                style={inputStyle}
              />
            </Field>
          </div>
        )}

        {contentType !== "pages" && (
          <div className="w-[140px]">
            <Field label="Date">
              <input
                type="date"
                value={data.date}
                onChange={(e) => update("date", e.target.value)}
                className="w-full rounded border px-2 py-1 text-sm"
                style={inputStyle}
              />
            </Field>
          </div>
        )}

        {contentType === "posts" && (
          <div className="w-[200px]">
            <Field label="Tags (comma-separated)">
              <input
                type="text"
                value={data.tags}
                onChange={(e) => update("tags", e.target.value)}
                placeholder="react, nextjs"
                className="w-full rounded border px-2 py-1 text-sm"
                style={inputStyle}
              />
            </Field>
          </div>
        )}

        {contentType === "wiki" && (
          <div className="w-[150px]">
            <Field label="Category">
              <input
                type="text"
                value={data.category}
                onChange={(e) => update("category", e.target.value)}
                placeholder="Category"
                className="w-full rounded border px-2 py-1 text-sm"
                style={inputStyle}
              />
            </Field>
          </div>
        )}

        {contentType === "handbook" && (
          <>
            <div className="w-[150px]">
              <Field label="Section">
                <input
                  type="text"
                  value={data.section}
                  onChange={(e) => update("section", e.target.value)}
                  placeholder="Section name"
                  className="w-full rounded border px-2 py-1 text-sm"
                  style={inputStyle}
                />
              </Field>
            </div>
            <div className="w-[80px]">
              <Field label="Order">
                <input
                  type="number"
                  value={data.order}
                  onChange={(e) => update("order", parseInt(e.target.value) || 0)}
                  className="w-full rounded border px-2 py-1 text-sm"
                  style={inputStyle}
                />
              </Field>
            </div>
          </>
        )}

        {contentType === "pages" && (
          <div className="flex-1 min-w-[200px]">
            <Field label="Description">
              <input
                type="text"
                value={data.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Page description"
                className="w-full rounded border px-2 py-1 text-sm"
                style={inputStyle}
              />
            </Field>
          </div>
        )}

        <div className="w-[120px]">
          <Field label="Status">
            <select
              value={data.status}
              onChange={(e) => update("status", e.target.value)}
              className="w-full rounded border px-2 py-1 text-sm"
              style={inputStyle}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </Field>
        </div>
      </div>
    </div>
  );
}
