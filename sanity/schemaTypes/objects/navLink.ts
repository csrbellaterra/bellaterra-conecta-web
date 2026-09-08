import { defineField, defineType } from "sanity";

export default defineType({
  name: "navLink",
  title: "Enlace",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Texto", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "url", title: "URL", type: "string", validation: (Rule) => Rule.required() }),
  ],
  preview: {
    select: { title: "label", subtitle: "url" },
  },
});
