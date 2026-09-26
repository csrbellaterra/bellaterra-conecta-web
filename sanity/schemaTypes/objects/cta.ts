import { defineField, defineType } from "sanity";

/**
 * Llamada a la acción reutilizable. Puede apuntar a una URL normal
 * (otra página, ancla, enlace externo) o abrir directamente un
 * formulario V2 (ver sanity/schemaTypes/documents/form.ts) por su
 * slug — ambos casos cubiertos para no tener que elegir entre "link"
 * y "abrir formulario" a nivel de componente.
 */
export default defineType({
  name: "cta",
  title: "Llamada a la acción",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Texto del botón", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "actionType",
      title: "Acción",
      type: "string",
      options: {
        list: [
          { title: "Ir a una URL", value: "url" },
          { title: "Abrir un formulario", value: "form" },
        ],
        layout: "radio",
      },
      initialValue: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      title: "URL de destino",
      type: "string",
      description: "Ruta interna (ej. /estancias) o URL externa completa.",
      hidden: ({ parent }) => parent?.actionType !== "url",
    }),
    defineField({
      name: "form",
      title: "Formulario a abrir",
      type: "reference",
      to: [{ type: "form" }],
      hidden: ({ parent }) => parent?.actionType !== "form",
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "actionType" },
  },
});
