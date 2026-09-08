import { defineField, defineType } from "sanity";

export default defineType({
  name: "ctaSection",
  title: "Llamada a la acción (CTA)",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Título", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "ctaLabel", title: "Texto del botón", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "ctaUrl", title: "Destino del botón", type: "string", validation: (Rule) => Rule.required() }),
  ],
  preview: {
    select: { title: "heading", subtitle: "ctaLabel" },
  },
});
