import { StarIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

/**
 * Arquitectura de datos para el futuro "Hall of Fame" (nombre
 * provisional interno — la etiqueta pública se decidirá más
 * adelante). Personas, empresas, eventos o miembros de Comunidad que
 * hayan contribuido al impacto PLASTY y autorizado aparecer
 * públicamente.
 *
 * Fase 5 SOLO prepara el schema; la UI pública en /impacto
 * (ImpactCommunity) es deliberadamente muy sencilla y solo se activa
 * si `impact.hallOfFameEnabled` es true Y existe al menos un
 * contributor con publicationConsent = true. Sin registros publicados,
 * la sección no se muestra en absoluto (nunca una sección vacía).
 *
 * REGLA: solo se pueden renderizar públicamente contributors con
 * publicationConsent = true — ver lib/sanity/queries.ts
 * (impactContributorsQuery) y lib/content.ts (getImpactContributors),
 * que filtran esto en la propia consulta GROQ, no solo en el
 * componente.
 */
export default defineType({
  name: "impactContributor",
  title: "Comunidad que contribuye (Hall of Fame)",
  type: "document",
  icon: StarIcon,
  fields: [
    defineField({ name: "name", title: "Nombre", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "slug",
      title: "Slug (opcional)",
      type: "slug",
      options: { source: "name", maxLength: 96 },
    }),
    defineField({
      name: "type",
      title: "Tipo",
      type: "string",
      options: {
        list: [
          { title: "Persona", value: "person" },
          { title: "Empresa", value: "company" },
          { title: "Evento", value: "event" },
          { title: "Comunidad", value: "community" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "image", title: "Imagen", type: "imageWithAlt" }),
    defineField({ name: "logo", title: "Logo (opcional, para empresas)", type: "imageWithAlt" }),
    defineField({ name: "shortDescription", title: "Descripción corta", type: "text", rows: 2 }),
    defineField({ name: "kgAssociated", title: "Kg asociados (opcional)", type: "number" }),
    defineField({ name: "date", title: "Fecha (opcional)", type: "date" }),
    defineField({
      name: "relatedDoor",
      title: "Puerta relacionada (opcional)",
      type: "reference",
      to: [{ type: "door" }],
    }),
    defineField({ name: "featured", title: "Destacar", type: "boolean", initialValue: false }),
    defineField({
      name: "publicationConsent",
      title: "Autorización para publicar",
      description: "Obligatorio: solo se muestran públicamente los contributors con esta casilla activada.",
      type: "boolean",
      initialValue: false,
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "order", title: "Orden", type: "number" }),
  ],
  orderings: [{ title: "Orden manual", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "name", type: "type", consent: "publicationConsent", media: "image" },
    prepare({ title, type, consent, media }) {
      return { title, subtitle: `${type}${consent ? "" : " · sin autorización de publicación"}`, media };
    },
  },
});
