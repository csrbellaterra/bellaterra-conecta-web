import { defineField, defineType } from "sanity";

/**
 * Imagen con texto alternativo obligatorio (accesibilidad + SEO) y
 * hotspot/crop activados para que el editor pueda elegir el punto
 * focal cuando la imagen se recorta en distintos formatos.
 */
export default defineType({
  name: "imageWithAlt",
  title: "Imagen",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Texto alternativo",
      type: "string",
      description: "Describe la imagen. Obligatorio para accesibilidad y SEO.",
      validation: (Rule) => Rule.required().warning("El texto alternativo es importante para SEO y accesibilidad."),
    }),
  ],
  preview: {
    select: { imageUrl: "asset.url", title: "alt" },
  },
});
