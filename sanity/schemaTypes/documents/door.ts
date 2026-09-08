import { defineField, defineType } from "sanity";

const DOOR_IDS = [
  { title: "Empresas", value: "empresas" },
  { title: "Eventos", value: "eventos" },
  { title: "Estancias", value: "estancias" },
  { title: "Comunidad", value: "comunidad" },
  { title: "Pickleball", value: "pickleball" },
];

/**
 * Una de las 5 puertas/experiencias. El slug debe coincidir siempre
 * con uno de los 5 DoorId (empresas/eventos/estancias/comunidad/
 * pickleball) porque las rutas de Next.js (/app/empresas, etc.) y el
 * tipo DoorId en types/content.ts están fijados a esos 5 valores.
 */
export default defineType({
  name: "door",
  title: "Puerta / experiencia",
  type: "document",
  groups: [
    { name: "content", title: "Contenido", default: true },
    { name: "gallery", title: "Galería" },
    { name: "impact", title: "Impacto" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Nombre",
      type: "string",
      validation: (Rule) => Rule.required(),
      group: "content",
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      description: "Debe ser exactamente uno de: empresas, eventos, estancias, comunidad, pickleball.",
      options: {
        source: "name",
        slugify: (input: string) => input.toLowerCase().replace(/\s+/g, "-"),
      },
      validation: (Rule) =>
        Rule.required().custom((slug) => {
          const allowed = DOOR_IDS.map((d) => d.value);
          if (slug?.current && !allowed.includes(slug.current)) {
            return `El slug debe ser uno de: ${allowed.join(", ")}`;
          }
          return true;
        }),
      group: "content",
    }),
    defineField({
      name: "order",
      title: "Orden (1–5)",
      type: "number",
      description: "Orden en el selector de la home: 01 Empresas, 02 Eventos, 03 Estancias, 04 Comunidad, 05 Pickleball.",
      validation: (Rule) => Rule.required().min(1).max(5),
      group: "content",
    }),
    defineField({
      name: "icon",
      title: "Icono",
      type: "string",
      options: {
        list: [
          { title: "Empresas (maletín)", value: "briefcase" },
          { title: "Eventos (fiesta)", value: "party" },
          { title: "Estancias (cama)", value: "bed" },
          { title: "Comunidad", value: "community" },
          { title: "Pickleball", value: "pickleball" },
        ],
      },
      group: "content",
    }),
    defineField({
      name: "eyebrow",
      title: "Descripción corta (para la tarjeta del selector)",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.required(),
      group: "content",
    }),
    defineField({
      name: "shortDescription",
      title: "Descripción corta (alternativa/listados)",
      type: "text",
      rows: 2,
      group: "content",
    }),
    defineField({
      name: "selectorImage",
      title: "Imagen de la tarjeta del selector",
      type: "imageWithAlt",
      validation: (Rule) => Rule.required(),
      group: "content",
    }),
    defineField({
      name: "heroMedia",
      title: "Imagen/vídeo de portada de la página de la puerta",
      type: "mediaField",
      validation: (Rule) => Rule.required(),
      group: "content",
    }),
    defineField({
      name: "headline",
      title: "Titular de la sección de experiencia en la home",
      type: "string",
      validation: (Rule) => Rule.required(),
      group: "content",
    }),
    defineField({
      name: "introduction",
      title: "Introducción (página de la puerta)",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
      group: "content",
    }),
    defineField({
      name: "contentBlocks",
      title: "Bloques de contenido adicionales",
      type: "array",
      of: [
        { type: "textSection" },
        { type: "imageTextSection" },
        { type: "gallerySection" },
        { type: "fullWidthMediaSection" },
        { type: "ctaSection" },
      ],
      group: "content",
    }),
    defineField({
      name: "gallery",
      title: "Galería de fotos",
      type: "array",
      of: [{ type: "imageWithAlt" }],
      group: "gallery",
    }),
    defineField({
      name: "ctaLabel",
      title: "Texto del botón de contacto",
      type: "string",
      initialValue: "Consultar disponibilidad",
      group: "content",
    }),
    defineField({
      name: "ctaUrl",
      title: "Destino del botón de contacto",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "plastyContribution",
      title: "Aportación PLASTY",
      type: "plastyContribution",
      description: "Cifras reales confirmadas en el Documento Fundacional. No inventar ni redondear.",
      group: "impact",
    }),
    defineField({ name: "seo", title: "SEO", type: "seoFields", group: "seo" }),
  ],
  orderings: [
    {
      title: "Orden del selector",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "headline", media: "selectorImage" },
  },
});
