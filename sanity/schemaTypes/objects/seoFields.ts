import { defineField, defineType } from "sanity";

export default defineType({
  name: "seoFields",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Título SEO",
      type: "string",
      description: "Se usa en la pestaña del navegador y en resultados de búsqueda. Si se deja vacío, se usa el título de la página.",
      validation: (Rule) => Rule.max(60).warning("Se recomiendan menos de 60 caracteres."),
    }),
    defineField({
      name: "description",
      title: "Meta descripción",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(160).warning("Se recomiendan menos de 160 caracteres."),
    }),
    defineField({
      name: "ogImage",
      title: "Imagen para compartir (redes sociales)",
      type: "imageWithAlt",
      description: "Se muestra al compartir el enlace en WhatsApp, Instagram, etc. Recomendado 1200×630px.",
    }),
  ],
  options: { collapsible: true, collapsed: true },
});
