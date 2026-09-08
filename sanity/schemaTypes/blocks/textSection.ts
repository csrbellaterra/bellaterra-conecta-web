import { defineField, defineType } from "sanity";

export default defineType({
  name: "textSection",
  title: "Bloque de texto",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Texto superior pequeño", type: "string" }),
    defineField({ name: "heading", title: "Título (opcional)", type: "string" }),
    defineField({ name: "body", title: "Texto", type: "text", rows: 5, validation: (Rule) => Rule.required() }),
  ],
  preview: {
    select: { title: "heading", subtitle: "body" },
  },
});
