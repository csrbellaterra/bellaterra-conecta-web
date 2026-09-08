import { defineField, defineType } from "sanity";

export default defineType({
  name: "fullWidthMediaSection",
  title: "Imagen/vídeo a ancho completo",
  type: "object",
  fields: [
    defineField({ name: "media", title: "Imagen o vídeo", type: "mediaField", validation: (Rule) => Rule.required() }),
    defineField({ name: "caption", title: "Pie de foto (opcional)", type: "string" }),
    defineField({ name: "overlayText", title: "Texto superpuesto (opcional)", type: "string" }),
  ],
  preview: {
    select: { title: "caption", media: "media.image" },
    prepare({ title, media }) {
      return { title: `Media a ancho completo: ${title || ""}`, media };
    },
  },
});
