import { defineField, defineType } from "sanity";

const QUESTION_TYPES = [
  { title: "Texto corto", value: "shortText" },
  { title: "Texto largo", value: "longText" },
  { title: "Email", value: "email" },
  { title: "Teléfono", value: "phone" },
  { title: "Número", value: "number" },
  { title: "Fecha", value: "date" },
  { title: "Desplegable (una opción)", value: "select" },
  { title: "Selección múltiple", value: "multiSelect" },
  { title: "Opción única (botones)", value: "singleChoice" },
  { title: "Casillas (checkbox)", value: "checkbox" },
  { title: "Sí / No", value: "yesNo" },
  { title: "Número de personas", value: "peopleCount" },
  { title: "Tarjetas visuales (optionCards)", value: "optionCards" },
];

const OPTION_BASED_TYPES = ["select", "multiSelect", "singleChoice", "checkbox", "optionCards"];

/**
 * Una pregunta dentro de un formulario V2 (ver documents/form.ts).
 * `id` es estable y se usa como clave en answersJson al enviar
 * (questionId/questionLabel/answer) para que el histórico de
 * respuestas siga teniendo sentido aunque más adelante se edite la
 * etiqueta o se borre la pregunta.
 *
 * `step`/`width` son pistas de maquetación para el motor de
 * formularios (agrupar preguntas en el mismo paso, ocupar media
 * columna vs. columna completa) — no de un editor de layout: el
 * componente decide cómo interpretarlas.
 *
 * `conditionalLogic` permite mostrar la pregunta solo si otra
 * pregunta anterior tiene cierto valor (ej. mostrar "¿Cuántos niños?"
 * solo si "¿Vienen niños?" = Sí).
 */
export default defineType({
  name: "formQuestion",
  title: "Pregunta",
  type: "object",
  fields: [
    defineField({
      name: "id",
      title: "Id estable",
      type: "string",
      description: "No lo cambies una vez publicado el formulario: se usa para asociar respuestas antiguas. Ej. \"nombre\", \"num_personas\".",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "type", title: "Tipo de pregunta", type: "string", options: { list: QUESTION_TYPES }, validation: (Rule) => Rule.required() }),
    defineField({ name: "label", title: "Pregunta / etiqueta", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "helpText", title: "Texto de ayuda (opcional)", type: "string" }),
    defineField({ name: "placeholder", title: "Placeholder (opcional)", type: "string" }),
    defineField({ name: "required", title: "Obligatoria", type: "boolean", initialValue: true }),
    defineField({
      name: "options",
      title: "Opciones",
      type: "array",
      of: [{ type: "formOption" }],
      hidden: ({ parent }) => !OPTION_BASED_TYPES.includes(parent?.type),
    }),
    defineField({
      name: "step",
      title: "Paso (opcional)",
      type: "number",
      description: "Preguntas con el mismo número de paso se agrupan en la misma pantalla si el formulario usa flujo por pasos.",
    }),
    defineField({
      name: "width",
      title: "Ancho",
      type: "string",
      options: { list: [{ title: "Columna completa", value: "full" }, { title: "Media columna", value: "half" }] },
      initialValue: "full",
    }),
    defineField({
      name: "conditionalLogic",
      title: "Lógica condicional (opcional)",
      type: "object",
      description: "Muestra esta pregunta solo si otra pregunta anterior cumple una condición.",
      fields: [
        defineField({ name: "dependsOnQuestionId", title: "Id de la pregunta de la que depende", type: "string" }),
        defineField({
          name: "condition",
          title: "Condición",
          type: "string",
          options: { list: [{ title: "Es igual a", value: "equals" }, { title: "No es igual a", value: "notEquals" }] },
          initialValue: "equals",
        }),
        defineField({ name: "value", title: "Valor a comparar", type: "string" }),
      ],
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "type" },
  },
});
