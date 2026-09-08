import { defineField, defineType } from "sanity";

export default defineType({
  name: "heroSection",
  title: "Hero (portada a pantalla completa)",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Texto superior pequeño", type: "string" }),
    defineField({
      name: "title",
      title: "Título / eslogan",
      type: "string",
      description: 'Eslogan del hero de portada. Por defecto "Una finca. Cinco formas de vivirla." — no confundir con el eslogan fundacional "Una finca. Cinco puertas. Un impacto compartido.", que puede usarse en otras páginas.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "subtitle", title: "Subtítulo (opcional)", type: "string" }),
    defineField({ name: "location", title: "Línea de ubicación", type: "string", initialValue: "Bellaterra · Barcelona" }),
    defineField({ name: "media", title: "Imagen o vídeo de fondo", type: "mediaField", validation: (Rule) => Rule.required() }),
    defineField({ name: "ctaLabel", title: "Texto del botón/scroll", type: "string" }),
    defineField({ name: "ctaUrl", title: "Destino del botón/scroll", type: "string" }),
  ],
  preview: {
    select: { title: "title", media: "media.image" },
    prepare({ title, media }) {
      return { title: `Hero: ${title || "sin título"}`, media };
    },
  },
});
