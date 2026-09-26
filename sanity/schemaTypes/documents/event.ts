import { CalendarIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

/**
 * Evento programado — de momento pensado sobre todo para los Family
 * Days (Comunidad/Pickleball), pero con un campo `type` abierto por
 * si en el futuro hay otros tipos de evento programado publicable.
 *
 * `schedule` es una franja horaria libre (no una franja rígida con
 * validación de solapamiento): cada línea es "hora + qué ocurre",
 * igual que en el flyer original. `registrationForm` referencia un
 * documento `form` (ver form.ts) para que "APÚNTATE →" abra el
 * formulario correcto de ese Family Day concreto.
 */
export default defineType({
  name: "event",
  title: "Evento (Family Day, etc.)",
  type: "document",
  icon: CalendarIcon,
  groups: [
    { name: "content", title: "Contenido", default: true },
    { name: "schedule", title: "Horario" },
    { name: "registration", title: "Inscripción" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "title", title: "Título", type: "string", validation: (Rule) => Rule.required(), group: "content" }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
      group: "content",
    }),
    defineField({
      name: "type",
      title: "Tipo de evento",
      type: "string",
      options: {
        list: [{ title: "Family Day", value: "familyDay" }],
        layout: "radio",
      },
      initialValue: "familyDay",
      validation: (Rule) => Rule.required(),
      group: "content",
    }),
    defineField({ name: "date", title: "Fecha", type: "date", validation: (Rule) => Rule.required(), group: "content" }),
    defineField({ name: "startTime", title: "Hora de inicio", type: "string", description: "Formato 24h, ej. 09:15.", group: "content" }),
    defineField({ name: "endTime", title: "Hora de fin", type: "string", description: "Formato 24h, ej. 18:00.", group: "content" }),
    defineField({
      name: "status",
      title: "Estado",
      type: "string",
      options: {
        list: [
          { title: "Próximamente", value: "upcoming" },
          { title: "Inscripciones abiertas", value: "open" },
          { title: "Completo", value: "full" },
          { title: "Cerrado", value: "closed" },
          { title: "Pasado", value: "past" },
        ],
      },
      initialValue: "upcoming",
      validation: (Rule) => Rule.required(),
      group: "content",
    }),
    defineField({ name: "priceText", title: "Precio (texto libre)", type: "string", description: "Ej. \"10 €\", \"Gratuito\".", group: "content" }),
    defineField({ name: "shortDescription", title: "Descripción corta", type: "text", rows: 3, group: "content" }),
    defineField({ name: "media", title: "Imagen o vídeo", type: "media", group: "content" }),
    defineField({ name: "mobileMedia", title: "Imagen o vídeo para móvil (opcional)", type: "media", group: "content" }),
    defineField({
      name: "schedule",
      title: "Programa del día",
      type: "array",
      of: [
        {
          type: "object",
          name: "scheduleItem",
          fields: [
            defineField({ name: "time", title: "Hora / franja", type: "string", description: "Ej. \"09:15 – 10:15\".", validation: (Rule) => Rule.required() }),
            defineField({ name: "activity", title: "Actividad", type: "string", validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: "activity", subtitle: "time" } },
        },
      ],
      group: "schedule",
    }),
    defineField({
      name: "registrationForm",
      title: "Formulario de inscripción",
      type: "reference",
      to: [{ type: "form" }],
      group: "registration",
    }),
    defineField({
      name: "registrationOpen",
      title: "Inscripciones abiertas",
      type: "boolean",
      initialValue: true,
      group: "registration",
    }),
    defineField({
      name: "capacity",
      title: "Aforo (opcional)",
      type: "number",
      group: "registration",
    }),
    defineField({
      name: "featured",
      title: "Destacar en la home",
      type: "boolean",
      initialValue: false,
      group: "content",
    }),
    defineField({ name: "seo", title: "SEO", type: "seoFields", group: "seo" }),
  ],
  orderings: [
    { title: "Fecha (próxima primero)", name: "dateAsc", by: [{ field: "date", direction: "asc" }] },
  ],
  preview: {
    select: { title: "title", date: "date", status: "status", media: "media.image" },
    prepare({ title, date, status, media }) {
      return { title, subtitle: [date, status].filter(Boolean).join(" · "), media };
    },
  },
});
