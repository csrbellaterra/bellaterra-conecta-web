import { defineField, defineType } from "sanity";

/**
 * Aportación PLASTY de una puerta concreta (ej. "59€ / 70kg por
 * evento reservado"). Estas cifras deben coincidir con el Documento
 * Fundacional — no inventar ni redondear al editar desde Studio.
 */
export default defineType({
  name: "plastyContribution",
  title: "Aportación PLASTY",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Etiqueta",
      type: "string",
      description: 'Ej. "Por evento reservado", "Por cada noche reservada".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "amountEur",
      title: "Importe (€)",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "kg",
      title: "Kg de plástico recuperado",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "note",
      title: "Nota / matiz",
      type: "text",
      rows: 2,
      description: "Ej. condiciones de vigencia, qué queda fuera de la aportación, etc.",
    }),
  ],
});
