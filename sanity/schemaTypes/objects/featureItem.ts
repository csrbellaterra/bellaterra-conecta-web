import { defineField, defineType } from "sanity";

/**
 * Un "concepto" visual grande — no una card SaaS pequeña. Se usa para
 * bloques como "Reunirse / Crear / Conectar" en Empresas, los 5
 * "momentos" de Nuestra Historia, etc. Cada featureItem se piensa
 * para ocupar espacio real en la página (foto grande + texto), nunca
 * como icono+título+una línea en una grid de 4 columnas.
 */
export default defineType({
  name: "featureItem",
  title: "Concepto / momento",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Texto superior pequeño (opcional)", type: "string" }),
    defineField({ name: "title", title: "Título", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "body", title: "Texto", type: "text", rows: 3 }),
    defineField({ name: "media", title: "Imagen o vídeo", type: "media" }),
    defineField({ name: "ctaLabel", title: "Texto del enlace (opcional)", type: "string" }),
    defineField({ name: "ctaUrl", title: "Destino del enlace (opcional)", type: "string" }),
  ],
  preview: {
    select: { title: "title", subtitle: "eyebrow", media: "media.image" },
  },
});
