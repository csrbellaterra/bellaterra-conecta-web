import { defineField, defineType } from "sanity";

/**
 * Una opción dentro de una pregunta de tipo select/multiSelect/
 * singleChoice/checkbox/optionCards. `media` solo se usa quando la
 * pregunta es `optionCards` (tarjetas visuales tipo Restauración/
 * Pickleball/Jardín/Piscina/Alojamiento/Barbacoa) — para el resto de
 * tipos se ignora, pero se deja disponible en todas para no tener que
 * mantener dos schemas de opción distintos.
 */
export default defineType({
  name: "formOption",
  title: "Opción",
  type: "object",
  fields: [
    defineField({
      name: "value",
      title: "Valor (id estable)",
      type: "string",
      description: "Identificador interno, no cambia aunque cambie la etiqueta. Ej. \"restauracion\".",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "label", title: "Etiqueta visible", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "description", title: "Descripción corta (opcional)", type: "string", description: "Se usa en tarjetas de tipo optionCards." }),
    defineField({ name: "media", title: "Imagen (opcional, para optionCards)", type: "media" }),
  ],
  preview: {
    select: { title: "label", subtitle: "value" },
  },
});
