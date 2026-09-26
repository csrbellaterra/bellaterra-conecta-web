import { defineField, defineType } from "sanity";

/**
 * Referencia a otra puerta/experiencia para los bloques "Quizá
 * también te interese" al final de las páginas de puerta. Es una
 * referencia simple a `door` con una nota opcional editorial (ej.
 * "Perfecto para después de tu evento") en vez de reusar el texto
 * genérico de la puerta referenciada.
 */
export default defineType({
  name: "relatedExperience",
  title: "Experiencia relacionada",
  type: "object",
  fields: [
    defineField({
      name: "door",
      title: "Puerta",
      type: "reference",
      to: [{ type: "door" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "note",
      title: "Nota editorial (opcional)",
      type: "string",
      description: "Ej. \"Perfecto para después de tu evento\". Si se deja vacío, se usa el resumen por defecto de la puerta.",
    }),
  ],
  preview: {
    select: { title: "door.headline", subtitle: "note", media: "door.heroMedia.image" },
    prepare({ title, subtitle, media }) {
      return { title: title || "Experiencia relacionada", subtitle, media };
    },
  },
});
