import { config, collection, fields } from "@keystatic/core";

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
        date: fields.date({ label: "Date" }),
        author: fields.text({ label: "Author" }),
        tags: fields.array(fields.text({ label: "Tag" }), {
          label: "Tags",
          itemLabel: (props) => props.value,
        }),
        status: fields.select({
          label: "Status",
          options: [
            { label: "Draft", value: "draft" },
            { label: "Published", value: "published" },
          ],
          defaultValue: "draft",
        }),
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
        date: fields.date({ label: "Date" }),
        author: fields.text({ label: "Author" }),
        category: fields.text({ label: "Category" }),
        status: fields.select({
          label: "Status",
          options: [
            { label: "Draft", value: "draft" },
            { label: "Published", value: "published" },
          ],
          defaultValue: "draft",
        }),
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
        date: fields.date({ label: "Date" }),
        author: fields.text({ label: "Author" }),
        section: fields.text({ label: "Section" }),
        order: fields.integer({ label: "Order", defaultValue: 0 }),
        status: fields.select({
          label: "Status",
          options: [
            { label: "Draft", value: "draft" },
            { label: "Published", value: "published" },
          ],
          defaultValue: "draft",
        }),
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
        description: fields.text({ label: "Description", multiline: true }),
        status: fields.select({
          label: "Status",
          options: [
            { label: "Draft", value: "draft" },
            { label: "Published", value: "published" },
          ],
          defaultValue: "draft",
        }),
        body: fields.mdx({ label: "Body" }),
      },
    }),
  },
});
