import { config, collection, fields } from "@keystatic/core";

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

export default config({
  storage: {
    kind: "local",
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
        body: fields.mdx({ label: "Body" }),
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
        body: fields.mdx({ label: "Body" }),
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
        body: fields.mdx({ label: "Body" }),
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
        body: fields.mdx({ label: "Body" }),
      },
    }),
  },
});
