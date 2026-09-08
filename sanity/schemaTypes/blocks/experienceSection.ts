import { defineField, defineType } from "sanity";

/**
 * Igual que imageTextSection, pero vinculado opcionalmente a una
 * puerta concreta — se usa en las 5 secciones alternadas de la home
 * ("Salir de la oficina cambia la conversación.", etc.).
 */
export default defineType({
  name: "experienceSection",
  title: "Sección de experiencia (puerta)",
  type: "object",
  fields: [
    defineField({
      name: "doorId",
      title: "Puerta relacionada",
      type: "string",
      options: {
        list: [
          { title: "Empresas", value: "empresas" },
          { title: "Eventos", value: "eventos" },
          { title: "Estancias", value: "estancias" },
          { title: "Comunidad", value: "comunidad" },
          { title: "Pickleball", value: "pickleball" },
        ],
      },
    }),
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
    select: { title: "headline", door: "doorId", media: "media.image" },
    prepare({ title, door, media }) {
      return { title: `Experiencia (${door || "sin puerta"}): ${title || ""}`, media };
    },
  },
});
