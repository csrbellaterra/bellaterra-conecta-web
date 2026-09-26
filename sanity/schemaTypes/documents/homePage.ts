import { HomeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

/**
 * Documento único (singleton) para la home. Sigue la estructura
 * exacta de la maqueta aprobada: hero → selector de 5 puertas → 5
 * secciones de experiencia (definidas como bloques reutilizables en
 * cada puerta, no aquí) → sección de conexión → sección de impacto →
 * CTA final.
 */
export default defineType({
  name: "homePage",
  title: "Página de inicio",
  type: "document",
  icon: HomeIcon,
  groups: [
    { name: "hero", title: "Hero" },
    { name: "selector", title: "Selector de puertas" },
    { name: "connection", title: "Conexión" },
    { name: "impact", title: "Impacto" },
    { name: "plasty", title: "PLASTY (V2)" },
    { name: "finalCta", title: "CTA final (V2)" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "hero", title: "Hero", type: "heroSection", group: "hero" }),
    defineField({
      name: "selectorHeading",
      title: "Título del selector",
      type: "string",
      initialValue: "¿Qué te gustaría hacer aquí?",
      group: "selector",
    }),
    defineField({
      name: "selectorSubheading",
      title: "Subtítulo del selector (heredado)",
      type: "string",
      description: "Campo antiguo, se mantiene por compatibilidad. Usa mejor \"Introducción del selector\" (selectorIntroduction) más abajo.",
      initialValue: "Descubre Bellaterra Conecta a tu manera.",
      group: "selector",
    }),
    defineField({
      name: "selectorIntroduction",
      title: "Introducción del selector (V2)",
      type: "text",
      rows: 2,
      description: "Texto bajo el título del selector de las 5 puertas. Si se deja vacío, se usa selectorSubheading o el texto por defecto.",
      group: "selector",
    }),
    defineField({
      name: "connectionSection",
      title: "Sección de conexión (heredado)",
      type: "object",
      group: "connection",
      description:
        'La media de esta sección sigue siendo el campo activo (connectionSection.media). El título ("heading") se mantiene por compatibilidad — usa mejor "Título de conexión" (connectionHeadline) más abajo.',
      fields: [
        defineField({ name: "heading", title: "Título (heredado)", type: "text", rows: 2 }),
        defineField({ name: "media", title: "Imagen o vídeo", type: "mediaField" }),
      ],
    }),
    defineField({
      name: "connectionEyebrow",
      title: "Texto superior de conexión (V2, opcional)",
      type: "string",
      group: "connection",
    }),
    defineField({
      name: "connectionHeadline",
      title: "Título de conexión (V2)",
      type: "text",
      rows: 2,
      description: "Si se deja vacío, se usa connectionSection.heading o el texto por defecto.",
      group: "connection",
    }),
    defineField({ name: "impactSection", title: "Sección de impacto (heredado)", type: "impactSection", group: "impact" }),
    defineField({
      name: "plastyEyebrow",
      title: "Texto superior PLASTY (V2)",
      type: "string",
      initialValue: "PLASTY",
      group: "plasty",
    }),
    defineField({
      name: "plastyHeadline",
      title: "Título PLASTY (V2)",
      type: "string",
      description: "Si se deja vacío, se usa impactSection.heading o el texto por defecto.",
      group: "plasty",
    }),
    defineField({
      name: "plastyBody",
      title: "Texto PLASTY (V2)",
      type: "text",
      rows: 3,
      description: "Solo se muestra cuando el contador de impacto está desactivado. Si se deja vacío, se usa impactSection.body o el texto por defecto.",
      group: "plasty",
    }),
    defineField({
      name: "plastyCtaLabel",
      title: "Texto del botón PLASTY (V2)",
      type: "string",
      group: "plasty",
    }),
    defineField({
      name: "plastyCtaUrl",
      title: "Destino del botón PLASTY (V2)",
      type: "string",
      description: 'Por defecto "/impacto" si se deja vacío.',
      group: "plasty",
    }),
    defineField({ name: "footerCta", title: "CTA final (heredado)", type: "ctaSection", group: "finalCta" }),
    defineField({
      name: "finalCtaEyebrow",
      title: "Texto superior del CTA final (V2, opcional)",
      type: "string",
      group: "finalCta",
    }),
    defineField({
      name: "finalCtaHeadline",
      title: "Título del CTA final (V2)",
      type: "string",
      description: "Si se deja vacío, se usa footerCta.heading o el texto por defecto.",
      group: "finalCta",
    }),
    defineField({
      name: "finalCtaBody",
      title: "Texto del CTA final (V2)",
      type: "text",
      rows: 2,
      group: "finalCta",
    }),
    defineField({
      name: "finalCtaLabel",
      title: "Texto del botón del CTA final (V2)",
      type: "string",
      description: "Si se deja vacío, se usa footerCta.ctaLabel o el texto por defecto.",
      group: "finalCta",
    }),
    defineField({
      name: "finalCtaForm",
      title: "Formulario que abre el CTA final (V2)",
      type: "reference",
      to: [{ type: "form" }],
      description: "Si se rellena, el botón abre /solicitud/[slug de este formulario]. Tiene prioridad sobre la URL de abajo.",
      group: "finalCta",
    }),
    defineField({
      name: "finalCtaUrl",
      title: "URL del CTA final (V2, alternativa al formulario)",
      type: "string",
      description: 'Se usa solo si no hay formulario seleccionado arriba. Por defecto "/solicitud/general" si ambos se dejan vacíos.',
      group: "finalCta",
    }),
    defineField({ name: "seo", title: "SEO", type: "seoFields", group: "seo" }),
  ],
  preview: {
    prepare() {
      return { title: "Página de inicio" };
    },
  },
});
