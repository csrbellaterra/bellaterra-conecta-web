import { defineField, defineType } from "sanity";

export default defineType({
  name: "impactSection",
  title: "Sección de impacto (PLASTY)",
  type: "object",
  description:
    "OJO: esta sección enlaza a /impacto, pero NO es una sexta puerta y no debe mostrar ninguna cifra aquí. La cifra total de kg recuperados se gestiona solo desde el documento \"Impacto\" (impactEnabled) y solo se publica cuando sea un dato real y verificado.",
  fields: [
    defineField({ name: "heading", title: "Título", type: "string", initialValue: "Nuestro impacto" }),
    defineField({ name: "body", title: "Texto", type: "text", rows: 3 }),
    defineField({ name: "ctaLabel", title: "Texto del botón", type: "string", initialValue: "Conoce nuestro impacto" }),
    defineField({ name: "ctaUrl", title: "Destino del botón", type: "string", initialValue: "/impacto" }),
  ],
  preview: {
    select: { title: "heading" },
    prepare({ title }) {
      return { title: `Impacto: ${title || ""}` };
    },
  },
});
