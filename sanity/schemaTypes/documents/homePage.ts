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
      title: "Subtítulo del selector",
      type: "string",
      initialValue: "Descubre Bellaterra Conecta a tu manera.",
      group: "selector",
    }),
    defineField({
      name: "connectionSection",
      title: "Sección de conexión",
      type: "object",
      group: "connection",
      description: 'La sección "Cinco formas de entrar. Un mismo lugar al que volver."',
      fields: [
        defineField({ name: "heading", title: "Título", type: "text", rows: 2 }),
        defineField({ name: "media", title: "Imagen o vídeo", type: "mediaField" }),
      ],
    }),
    defineField({ name: "impactSection", title: "Sección de impacto", type: "impactSection", group: "impact" }),
    defineField({ name: "footerCta", title: "CTA final (opcional)", type: "ctaSection", group: "connection" }),
    defineField({ name: "seo", title: "SEO", type: "seoFields", group: "seo" }),
  ],
  preview: {
    prepare() {
      return { title: "Página de inicio" };
    },
  },
});
