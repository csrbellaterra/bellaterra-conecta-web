import { defineField, defineType } from "sanity";

/**
 * Documento único (singleton) que controla la cifra de impacto
 * global de PLASTY (los kg de plástico recuperado en total).
 *
 * REGLA IMPORTANTE (ver Documento Fundacional y EDITOR_GUIDE.md):
 * la cifra "12.480 kg" que aparece en la maqueta de diseño es un
 * marcador de ejemplo, NO un dato real. impactEnabled debe
 * permanecer en `false` hasta que exista una cifra verificada. Con
 * impactEnabled en false (o sin configurar), la sección de impacto
 * del sitio muestra un texto genérico sin ningún número.
 */
export default defineType({
  name: "impact",
  title: "Impacto (PLASTY)",
  type: "document",
  fields: [
    defineField({
      name: "impactEnabled",
      title: "Publicar cifra de impacto",
      type: "boolean",
      description: "Actívalo SOLO cuando impactKg sea un dato real y verificado. Mientras esté desactivado, el sitio muestra un mensaje genérico sin cifras.",
      initialValue: false,
    }),
    defineField({
      name: "impactKg",
      title: "Kg de plástico recuperado (total)",
      type: "number",
      hidden: ({ document }) => !document?.impactEnabled,
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const doc = context.document as { impactEnabled?: boolean } | undefined;
          if (doc?.impactEnabled && (value === undefined || value === null)) {
            return "Obligatorio si la cifra de impacto está activada.";
          }
          return true;
        }),
    }),
    defineField({
      name: "impactUpdatedAt",
      title: "Fecha de la última actualización de la cifra",
      type: "date",
      hidden: ({ document }) => !document?.impactEnabled,
    }),
    defineField({
      name: "impactMethodology",
      title: "Nota de metodología",
      type: "text",
      rows: 3,
      description: "Cómo se calcula la cifra (fuente, periodo, etc.). Se muestra junto al dato para que sea verificable.",
      hidden: ({ document }) => !document?.impactEnabled,
    }),
    defineField({
      name: "impactMethodologyUrl",
      title: "Enlace a la metodología completa (opcional)",
      type: "url",
      hidden: ({ document }) => !document?.impactEnabled,
    }),
  ],
  preview: {
    select: { enabled: "impactEnabled", kg: "impactKg" },
    prepare({ enabled, kg }) {
      return { title: "Impacto (PLASTY)", subtitle: enabled ? `Publicado: ${kg ?? "?"} kg` : "Sin publicar (genérico)" };
    },
  },
});
