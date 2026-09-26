import { ImagesIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

const CATEGORIES = [
  { title: "La finca", value: "finca" },
  { title: "Empresas", value: "empresas" },
  { title: "Eventos", value: "eventos" },
  { title: "Estancias", value: "estancias" },
  { title: "Comunidad", value: "comunidad" },
  { title: "Pickleball", value: "pickleball" },
];

/**
 * Un elemento de la página /galeria (imagen o vídeo). `order` permite
 * ordenar manualmente la grid editorial en vez de depender solo de
 * la fecha de creación en Sanity.
 */
export default defineType({
  name: "galleryItem",
  title: "Elemento de galería",
  type: "document",
  icon: ImagesIcon,
  fields: [
    defineField({ name: "title", title: "Título (opcional)", type: "string" }),
    defineField({ name: "media", title: "Imagen o vídeo", type: "media", validation: (Rule) => Rule.required() }),
    defineField({
      name: "category",
      title: "Categoría",
      type: "string",
      options: { list: CATEGORIES },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "caption", title: "Pie de foto (opcional)", type: "string" }),
    defineField({ name: "featured", title: "Destacar", type: "boolean", initialValue: false }),
    defineField({ name: "order", title: "Orden", type: "number", description: "Menor número aparece antes en la grid." }),
  ],
  orderings: [{ title: "Orden manual", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "title", category: "category", media: "media.image" },
    prepare({ title, category, media }) {
      return { title: title || "Elemento de galería", subtitle: category, media };
    },
  },
});
