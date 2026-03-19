import { config, collection, fields } from "@keystatic/core";
import { wrapper, block } from "@keystatic/core/content-components";

const localeField = fields.select({
  label: "Language",
  options: [
    { label: "English", value: "en" },
    { label: "Vietnamese (Tiếng Việt)", value: "vi" },
  ],
  defaultValue: "en",
});

const statusField = fields.select({
  label: "Status",
  options: [
    { label: "Draft", value: "draft" },
    { label: "Published", value: "published" },
  ],
  defaultValue: "draft",
});

const CALLOUT_COLORS: Record<string, string> = {
  info: "#3b82f6",
  warning: "#f59e0b",
  success: "#10b981",
  error: "#ef4444",
};

const mdxComponents = {
  Callout: wrapper({
    label: "Callout",
    schema: {
      type: fields.select({
        label: "Type",
        options: [
          { label: "Info", value: "info" },
          { label: "Warning", value: "warning" },
          { label: "Success", value: "success" },
          { label: "Error", value: "error" },
        ],
        defaultValue: "info",
      }),
    },
    ContentView({ value, children }) {
      const color = CALLOUT_COLORS[value.type] ?? CALLOUT_COLORS.info;
      return (
        <div
          style={{
            borderLeft: `4px solid ${color}`,
            background: `${color}18`,
            borderRadius: "0.375rem",
            padding: "0.75rem 1rem",
            marginBlock: "1rem",
          }}
        >
          {children}
        </div>
      );
    },
  }),
  Card: wrapper({
    label: "Card",
    schema: {
      title: fields.text({ label: "Title" }),
    },
    ContentView({ value, children }) {
      return (
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "0.5rem",
            padding: "1.25rem",
            marginBlock: "1rem",
          }}
        >
          {value.title && (
            <strong style={{ display: "block", marginBottom: "0.5rem" }}>
              {value.title}
            </strong>
          )}
          {children}
        </div>
      );
    },
  }),
};

const bodyField = fields.mdx({ label: "Body", components: mdxComponents });

export default config({
  storage: {
    kind: "local",
  },
  ui: {
    brand: { name: "Unimind" },
  },
  collections: {
    posts: collection({
      label: "Blog Posts",
      slugField: "title",
      path: "content/posts/*",
      format: { contentField: "body" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        locale: localeField,
        date: fields.date({ label: "Date" }),
        author: fields.text({ label: "Author" }),
        tags: fields.array(fields.text({ label: "Tag" }), {
          label: "Tags",
          itemLabel: (props) => props.value,
        }),
        status: statusField,
        coverImage: fields.image({
          label: "Cover Image",
          directory: "public/images/posts",
          publicPath: "/images/posts",
        }),
        body: bodyField,
      },
    }),
    wiki: collection({
      label: "Wiki Articles",
      slugField: "title",
      path: "content/wiki/*",
      format: { contentField: "body" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        locale: localeField,
        date: fields.date({ label: "Date" }),
        author: fields.text({ label: "Author" }),
        category: fields.text({ label: "Category" }),
        status: statusField,
        body: bodyField,
      },
    }),
    handbook: collection({
      label: "Handbook Entries",
      slugField: "title",
      path: "content/handbook/*",
      format: { contentField: "body" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        locale: localeField,
        date: fields.date({ label: "Date" }),
        author: fields.text({ label: "Author" }),
        section: fields.text({ label: "Section" }),
        order: fields.integer({ label: "Order", defaultValue: 0 }),
        status: statusField,
        body: bodyField,
      },
    }),
    pages: collection({
      label: "Landing Pages",
      slugField: "title",
      path: "content/pages/*",
      format: { contentField: "body" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        locale: localeField,
        description: fields.text({ label: "Description", multiline: true }),
        status: statusField,
        body: bodyField,
      },
    }),
  },
});
