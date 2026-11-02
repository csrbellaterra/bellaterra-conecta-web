import { defineField, defineType } from "sanity";

/**
 * Escena de la introducción cinematográfica de una puerta (door.cinematicIntro).
 * Una foto real de la finca (con variante móvil opcional) y un texto corto. El
 * movimiento es solo de cámara simulada sobre la foto: no se modifica la imagen.
 */
export default defineType({
  name: "cinematicScene",
  title: "Escena",
  type: "object",
  fields: [
    defineField({
      name: "media",
      title: "Fotografía",
      description: "Imagen horizontal para escritorio y, en «Imagen para móvil», un recorte vertical.",
      type: "media",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "eyebrow", title: "Antetítulo", type: "string", description: "Ej.: 01 · Reunirse" }),
    defineField({ name: "title", title: "Texto principal", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "body", title: "Texto secundario (opcional)", type: "text", rows: 2 }),
    defineField({
      name: "motion",
      title: "Movimiento",
      type: "string",
      options: {
        list: [
          { title: "Acercarse", value: "pushIn" },
          { title: "Alejarse", value: "pullOut" },
          { title: "Desplazar a la izquierda", value: "driftLeft" },
          { title: "Desplazar a la derecha", value: "driftRight" },
        ],
        layout: "radio",
      },
      initialValue: "pushIn",
    }),
  ],
  preview: { select: { title: "title", subtitle: "eyebrow", media: "media.image" } },
});
