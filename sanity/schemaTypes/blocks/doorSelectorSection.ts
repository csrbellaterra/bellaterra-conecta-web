import { defineField, defineType } from "sanity";

export default defineType({
  name: "doorSelectorSection",
  title: "Selector de 5 puertas",
  type: "object",
  description: "Muestra las 5 experiencias (puertas) como tarjetas horizontales, siempre las 5 a la vez — no es un carrusel.",
  fields: [
    defineField({
      name: "heading",
      title: "Título",
      type: "string",
      initialValue: "¿Qué te gustaría hacer aquí?",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subheading",
      title: "Subtítulo",
      type: "string",
      initialValue: "Descubre Bellaterra Conecta a tu manera.",
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare({ title }) {
      return { title: `Selector de puertas: ${title || ""}` };
    },
  },
});
