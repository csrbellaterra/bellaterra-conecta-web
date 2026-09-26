import { defineField, defineType } from "sanity";

/**
 * Un paso dentro de una narrativa visual tipo "storytelling" — por
 * ejemplo "Una jornada a vuestra manera" en Empresas. NO es un
 * horario rígido (no lleva hora obligatoria): es un momento del
 * relato, con su propia imagen, para transmitir flujo, no agenda.
 */
export default defineType({
  name: "timelineItem",
  title: "Momento del relato",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Etiqueta corta (opcional)", type: "string", description: "Ej. \"Por la mañana\", \"Al mediodía\" — no es obligatorio poner una hora exacta." }),
    defineField({ name: "title", title: "Título", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "body", title: "Texto", type: "text", rows: 3 }),
    defineField({ name: "media", title: "Imagen o vídeo", type: "media" }),
  ],
  preview: {
    select: { title: "title", subtitle: "label", media: "media.image" },
  },
});
