import { DocumentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

/**
 * Página genérica de contenido libre (La finca, Contacto, Impacto,
 * y cualquier página nueva que se quiera añadir sin tocar código:
 * ver EDITOR_GUIDE.md, sección "Añadir una página nueva").
 */
export default defineType({
  name: "page",
  title: "Página",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({ name: "title", title: "Título", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "blocks",
      title: "Bloques de contenido",
      type: "array",
      of: [
        { type: "heroSection" },
        { type: "doorSelectorSection" },
        { type: "imageTextSection" },
        { type: "experienceSection" },
        { type: "gallerySection" },
        { type: "impactSection" },
        { type: "textSection" },
        { type: "ctaSection" },
        { type: "fullWidthMediaSection" },
      ],
    }),
    defineField({ name: "seo", title: "SEO", type: "seoFields" }),
  ],
  preview: {
    select: { title: "title", subtitle: "slug.current" },
  },
});
