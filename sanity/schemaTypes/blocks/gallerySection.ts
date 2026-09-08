import { defineField, defineType } from "sanity";

export default defineType({
  name: "gallerySection",
  title: "Galería de imágenes",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Título (opcional)", type: "string" }),
    defineField({
      name: "images",
      title: "Imágenes",
      type: "array",
      of: [{ type: "imageWithAlt" }],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: { title: "heading", media: "images.0" },
    prepare({ title, media }) {
      return { title: `Galería: ${title || "sin título"}`, media };
    },
  },
});
