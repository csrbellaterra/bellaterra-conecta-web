import { defineField, defineType } from "sanity";

/**
 * Una cifra editorial (no un widget de dashboard corporativo) — se
 * usa por ejemplo en el desglose de PLASTY por puerta, o en cualquier
 * bloque que necesite mostrar un número con contexto breve.
 */
export default defineType({
  name: "stat",
  title: "Cifra",
  type: "object",
  fields: [
    defineField({ name: "value", title: "Valor", type: "string", description: "Texto libre para poder incluir unidades, ej. \"30 kg\", \"5\", \"1967\".", validation: (Rule) => Rule.required() }),
    defineField({ name: "label", title: "Etiqueta", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "note", title: "Nota adicional (opcional)", type: "string" }),
  ],
  preview: {
    select: { title: "value", subtitle: "label" },
  },
});
