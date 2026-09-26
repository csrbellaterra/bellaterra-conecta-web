import { EnvelopeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

/**
 * Documento único (singleton) para /contacto (Fase 5, corrección
 * posterior). NO es un page builder genérico: el diseño del router de
 * intención está fijado en código (ContactIntentRouter /
 * ContactDetails), Sanity solo controla el copy del hero, las 7 (o
 * las que se necesiten) opciones del router y los datos de contacto
 * secundarios — mismo patrón que storyPage.ts.
 *
 * `intents[]` sustituye a CONTACT_INTENT_OPTIONS de
 * lib/contactCopy.ts como fuente principal: cada intent tiene su
 * propio `order` y `enabled` para poder reordenar o desactivar una
 * opción (ej. Pickleball fuera de temporada) sin tocar código.
 * lib/contactCopy.ts se mantiene solo como fallback si Sanity no está
 * configurado o el documento no tiene intents todavía.
 */
export default defineType({
  name: "contactPage",
  title: "Contacto",
  type: "document",
  icon: EnvelopeIcon,
  groups: [
    { name: "hero", title: "Hero" },
    { name: "intents", title: "Opciones del router" },
    { name: "details", title: "Datos de contacto" },
  ],
  fields: [
    defineField({
      name: "heroEyebrow",
      title: "Texto superior (opcional)",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroHeadline",
      title: "Titular",
      type: "string",
      initialValue: "¿Qué te gustaría hacer en Bellaterra Conecta?",
      group: "hero",
    }),
    defineField({
      name: "heroBody",
      title: "Texto adicional (opcional)",
      type: "text",
      rows: 2,
      group: "hero",
    }),
    defineField({
      name: "intents",
      title: "Opciones del router de intención",
      description:
        "Cada opción lleva a un formulario de /solicitud/[slug] (o a cualquier otra URL). El orden de la lista aquí no importa: se ordena por el campo `order` de cada opción.",
      type: "array",
      group: "intents",
      of: [
        {
          type: "object",
          name: "contactIntent",
          fields: [
            defineField({
              name: "id",
              title: "Identificador",
              type: "string",
              description: 'Interno, ej. "empresas", "visita", "otra-cosa". No se muestra públicamente.',
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: "title", title: "Título", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "description", title: "Descripción", type: "text", rows: 2 }),
            defineField({
              name: "url",
              title: "URL de destino",
              type: "string",
              description: 'Ej. "/solicitud/empresas" o "/solicitud/general?ctaSource=visita".',
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: "order", title: "Orden", type: "number", validation: (Rule) => Rule.required() }),
            defineField({ name: "enabled", title: "Activa", type: "boolean", initialValue: true }),
            defineField({
              name: "icon",
              title: "Icono (opcional)",
              type: "string",
              description: "Reservado para uso futuro — el diseño actual del router no muestra icono.",
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "url", enabled: "enabled" },
            prepare({ title, subtitle, enabled }) {
              return { title: `${enabled === false ? "(desactivada) " : ""}${title}`, subtitle };
            },
          },
        },
      ],
    }),
    defineField({
      name: "locationText",
      title: "Dirección / ubicación",
      type: "string",
      description: "Si se deja vacío, se usa siteSettings.address.",
      group: "details",
    }),
    defineField({
      name: "email",
      title: "Email de contacto",
      type: "string",
      description: "Si se deja vacío, se usa siteSettings.email.",
      group: "details",
    }),
    defineField({
      name: "instagramUrl",
      title: "URL de Instagram",
      type: "string",
      description: "Si se deja vacío, se usa siteSettings.instagramUrl.",
      group: "details",
    }),
    defineField({
      name: "mapsUrl",
      title: "URL de Google Maps (opcional)",
      type: "string",
      group: "details",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Contacto" };
    },
  },
});
