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
    { name: "doorPage", title: "Página de la puerta (V2)" },
    { name: "home", title: "Teaser en la Home (V2)" },
    { name: "gallery", title: "Galería" },
    { name: "related", title: "Relacionadas" },
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
      name: "heroMobileMedia",
      title: "Imagen/vídeo de portada para móvil (opcional, V2)",
      type: "media",
      description: "Sustituye a heroMedia en pantallas estrechas. Si se deja vacío, se usa heroMedia.",
      group: "content",
    }),
    defineField({
      name: "heroEyebrow",
      title: "Texto superior del hero de la página (V2)",
      type: "string",
      description: 'Ej. "EMPRESAS". Si se deja vacío, se usa el nombre de la puerta.',
      group: "doorPage",
    }),
    defineField({
      name: "heroHeadline",
      title: "Titular del hero de la página (V2)",
      type: "text",
      rows: 2,
      description: "Titular grande del hero de /empresas, /eventos, etc. Si se deja vacío, se usa headline/homeHeadline o el nombre de la puerta.",
      group: "doorPage",
    }),
    defineField({
      name: "heroDescription",
      title: "Texto del hero de la página (V2)",
      type: "text",
      rows: 3,
      description: "Si se deja vacío, se usa introduction o un texto por defecto.",
      group: "doorPage",
    }),
    defineField({
      name: "primaryCtaLabel",
      title: "Texto del CTA principal del hero (V2)",
      type: "string",
      description: 'Ej. "ORGANIZA TU JORNADA". Si se deja vacío, se usa ctaLabel o un texto por defecto.',
      group: "doorPage",
    }),
    defineField({
      name: "featuresTitle",
      title: "Título de la sección 'Qué puedes hacer / celebrar' (V2)",
      type: "string",
      description: 'Ej. "Qué puedes hacer aquí" (Empresas) o "Qué puedes celebrar" (Eventos). Si se deja vacío, se usa un texto por defecto según la puerta.',
      group: "doorPage",
    }),
    defineField({
      name: "timelineTitle",
      title: "Título de la sección de storytelling/timeline (V2)",
      type: "text",
      rows: 2,
      group: "doorPage",
    }),
    defineField({
      name: "timelineItems",
      title: "Momentos del storytelling/timeline (V2)",
      description:
        "Ej. 'Una jornada a vuestra manera'. Es una inspiración de jornada, NO un horario obligatorio — se comunica así en la propia página.",
      type: "array",
      of: [{ type: "timelineItem" }],
      group: "doorPage",
    }),
    defineField({
      name: "spacesTitle",
      title: "Título de la sección de espacios (V2)",
      type: "string",
      group: "doorPage",
    }),
    defineField({
      name: "finalCtaHeadline",
      title: "Título del CTA final de la página (V2)",
      type: "string",
      group: "doorPage",
    }),
    defineField({
      name: "finalCtaBody",
      title: "Texto del CTA final de la página (V2)",
      type: "text",
      rows: 2,
      group: "doorPage",
    }),
    defineField({
      name: "finalCtaLabel",
      title: "Texto del botón del CTA final de la página (V2)",
      type: "string",
      group: "doorPage",
    }),
    defineField({
      name: "finalCtaForm",
      title: "Formulario del CTA final de la página (V2)",
      type: "reference",
      to: [{ type: "form" }],
      description: "Si se deja vacío, se usa primaryForm o el slug de esta puerta.",
      group: "doorPage",
    }),
    defineField({
      name: "homeEyebrow",
      title: "Texto superior del teaser en la Home (V2)",
      type: "string",
      description: "Si se deja vacío, se usa eyebrow o un texto por defecto.",
      group: "home",
    }),
    defineField({
      name: "homeHeadline",
      title: "Titular en la Home (V2)",
      type: "string",
      description: "Titular corto para la sección de esta puerta en la Home. Si se deja vacío, se usa headline o un texto por defecto. Puede ser más corto que el de la propia página.",
      group: "home",
    }),
    defineField({
      name: "homeDescription",
      title: "Descripción del teaser en la Home (V2)",
      type: "text",
      rows: 3,
      description: "Texto corto para la Home — no tiene que ser el mismo que introduction (que es más largo, para la propia página de la puerta). Si se deja vacío, se usa un texto por defecto.",
      group: "home",
    }),
    defineField({
      name: "homeCtaLabel",
      title: "Texto del botón en la Home (V2)",
      type: "string",
      description: 'Ej. "Descubre Empresas". Si se deja vacío, se usa "Descubre {nombre}".',
      group: "home",
    }),
    defineField({
      name: "homeMedia",
      title: "Imagen/vídeo del teaser en la Home (V2, opcional)",
      type: "media",
      description: "Solo si quieres usar una media distinta a la de la página interna. Si se deja vacío, se usa heroMedia.",
      group: "home",
    }),
    defineField({
      name: "headline",
      title: "Titular de la sección de experiencia en la home (heredado)",
      description:
        'Campo antiguo. Usa mejor "Titular en la Home" (homeHeadline) en la pestaña "Teaser en la Home" — este se mantiene como segundo fallback si ese está vacío.',
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
      name: "featureSections",
      title: "Secciones narrativas (V2)",
      description:
        "Bloques visuales grandes tipo 'Qué puedes hacer aquí' (conceptos) o 'Una jornada a vuestra manera' (relato paso a paso). No es una agenda rígida: es storytelling editable desde Sanity.",
      type: "array",
      of: [{ type: "featureItem" }, { type: "timelineItem" }],
      group: "content",
    }),
    defineField({
      name: "spacesGallery",
      title: "Galería de espacios (V2)",
      description: "Galería editorial de 'Espacios' con pie de foto opcional por imagen/vídeo.",
      type: "array",
      of: [
        {
          type: "object",
          name: "spaceItem",
          fields: [
            defineField({ name: "media", title: "Imagen o vídeo", type: "media", validation: (Rule) => Rule.required() }),
            defineField({ name: "caption", title: "Pie de foto (opcional)", type: "string" }),
          ],
          preview: { select: { title: "caption", media: "media.image" } },
        },
      ],
      group: "gallery",
    }),
    defineField({
      name: "relatedExperiences",
      title: "Quizá también te interese (V2)",
      description: "Otras puertas relacionadas, mostradas al final de la página.",
      type: "array",
      of: [{ type: "relatedExperience" }],
      group: "related",
    }),
    defineField({
      name: "primaryForm",
      title: "Formulario principal (V2)",
      description: "Formulario que abren los CTA de esta puerta (ej. FORM EMPRESAS para /empresas).",
      type: "reference",
      to: [{ type: "form" }],
      group: "content",
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
    defineField({
      name: "plastyContributionEnabled",
      title: "Mostrar aportación PLASTY (V2)",
      description: "Desactivado por defecto para Pickleball: la matrícula-escuela ya no existe y aún no hay un modelo nuevo definido. No actives esto para Pickleball sin una cifra confirmada.",
      type: "boolean",
      initialValue: true,
      group: "impact",
    }),
    defineField({
      name: "plastyContributionText",
      title: "Texto de la aportación PLASTY (V2)",
      description: "Texto libre a mostrar cuando plastyContributionEnabled está activo, ej. '30 kg por jornada'.",
      type: "string",
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
