import { EnvelopeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

/**
 * Formulario custom (nunca Google Forms/Typeform embed). Se puede
 * crear un formulario nuevo enteramente desde Sanity, sin tocar
 * código, siempre que el motor de formularios (ver
 * components/forms/FormRenderer y app/solicitud/[slug]) sepa
 * interpretar los tipos de pregunta definidos en formQuestion.ts.
 *
 * Cada formulario es accesible en /solicitud/[slug] además de poder
 * abrirse como modal/panel desde cualquier CTA (ver objects/cta.ts).
 */
export default defineType({
  name: "form",
  title: "Formulario",
  type: "document",
  icon: EnvelopeIcon,
  groups: [
    { name: "content", title: "Contenido", default: true },
    { name: "questions", title: "Preguntas" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "title", title: "Título (visible)", type: "string", validation: (Rule) => Rule.required(), group: "content" }),
    defineField({
      name: "slug",
      title: "Slug (URL: /solicitud/[slug])",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
      group: "content",
    }),
    defineField({
      name: "internalName",
      title: "Nombre interno (opcional)",
      type: "string",
      description: "Solo para identificarlo en el Studio, no se muestra en la web.",
      group: "content",
    }),
    defineField({ name: "active", title: "Activo", type: "boolean", initialValue: true, group: "content" }),
    defineField({ name: "introTitle", title: "Título de introducción", type: "string", group: "content" }),
    defineField({ name: "introText", title: "Texto de introducción", type: "text", rows: 3, group: "content" }),
    defineField({ name: "successTitle", title: "Título de confirmación", type: "string", initialValue: "¡Gracias!", group: "content" }),
    defineField({ name: "successText", title: "Texto de confirmación", type: "text", rows: 3, group: "content" }),
    defineField({ name: "submitLabel", title: "Texto del botón de envío", type: "string", initialValue: "Enviar", group: "content" }),
    defineField({
      name: "questions",
      title: "Preguntas",
      type: "array",
      of: [{ type: "formQuestion" }],
      validation: (Rule) => Rule.required().min(1),
      group: "questions",
    }),
    defineField({
      name: "steps",
      title: "Títulos de los pasos (opcional)",
      description:
        "Si el formulario agrupa preguntas por 'Paso' (ver campo Paso de cada pregunta), aquí puedes poner un título por cada número de paso (ej. Paso 1 → 'Sobre ti'). Si un paso no tiene título aquí, se muestra solo 'Paso N de M'.",
      type: "array",
      of: [
        {
          type: "object",
          name: "formStep",
          fields: [
            defineField({ name: "step", title: "Número de paso", type: "number", validation: (Rule) => Rule.required() }),
            defineField({ name: "title", title: "Título del paso", type: "string", validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: "title", subtitle: "step" } },
        },
      ],
      group: "questions",
    }),
    defineField({ name: "seo", title: "SEO", type: "seoFields", group: "seo" }),
  ],
  preview: {
    select: { title: "title", subtitle: "slug.current", active: "active" },
    prepare({ title, subtitle, active }) {
      return { title, subtitle: `/solicitud/${subtitle || ""}${active === false ? " · inactivo" : ""}` };
    },
  },
});
