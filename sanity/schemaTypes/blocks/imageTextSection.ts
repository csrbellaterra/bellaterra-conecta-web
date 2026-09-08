import { defineField, defineType } from "sanity";

export default defineType({
  name: "imageTextSection",
  title: "Sección imagen + texto",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Texto superior pequeño", type: "string" }),
    defineField({ name: "headline", title: "Titular", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "body", title: "Texto", type: "text", rows: 4, validation: (Rule) => Rule.required() }),
    defineField({ name: "ctaLabel", title: "Texto del enlace", type: "string" }),
    defineField({ name: "ctaUrl", title: "Destino del enlace", type: "string" }),
    defineField({ name: "media", title: "Imagen o vídeo", type: "mediaField", validation: (Rule) => Rule.required() }),
    defineField({
      name: "imageSide",
      title: "Lado de la imagen (escritorio)",
      type: "string",
      options: {
        list: [
          { title: "Izquierda", value: "left" },
          { title: "Derecha", value: "right" },
        ],
        layout: "radio",
      },
      initialValue: "left",
    }),
  ],
  preview: {
    select: { title: "headline", media: "media.image" },
    prepare({ title, media }) {
      return { title: `Imagen + texto: ${title || ""}`, media };
    },
  },
});
