import { CogIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

/**
 * Documento único (singleton, ver sanity/structure.ts): navegación,
 * logo, idiomas, footer y datos de contacto compartidos por todo el
 * sitio.
 */
export default defineType({
  name: "siteSettings",
  title: "Configuración del sitio",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({ name: "siteTitle", title: "Nombre del sitio", type: "string", initialValue: "Bellaterra Conecta" }),
    defineField({ name: "logo", title: "Logo", type: "imageWithAlt" }),
    defineField({
      name: "languages",
      title: "Idiomas",
      type: "array",
      description: "Deja solo ES activo mientras no haya traducciones reales a catalán/inglés.",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "code",
              title: "Código",
              type: "string",
              options: { list: ["es", "ca", "en"] },
            }),
            defineField({ name: "label", title: "Etiqueta", type: "string" }),
            defineField({ name: "enabled", title: "Activo", type: "boolean", initialValue: false }),
          ],
        },
      ],
    }),
    defineField({
      name: "showLanguageSwitcher",
      title: "Mostrar selector de idioma",
      type: "boolean",
      description: "Ocúltalo mientras solo haya un idioma activo.",
      initialValue: true,
    }),
    defineField({
      name: "navigation",
      title: "Menú de navegación",
      type: "array",
      of: [{ type: "navLink" }],
    }),
    defineField({ name: "address", title: "Dirección", type: "string" }),
    defineField({ name: "email", title: "Email de contacto", type: "string" }),
    defineField({ name: "phone", title: "Teléfono", type: "string" }),
    defineField({ name: "instagramUrl", title: "URL de Instagram", type: "url" }),
    defineField({ name: "linkedinUrl", title: "URL de LinkedIn", type: "url" }),
    defineField({
      name: "footerMessage",
      title: "Mensaje de despedida del pie de página",
      type: "string",
      initialValue: "Nos vemos en Bellaterra.",
    }),
    defineField({
      name: "footerLinks",
      title: "Enlaces del pie de página",
      type: "array",
      of: [{ type: "navLink" }],
    }),
    defineField({
      name: "legalLinks",
      title: "Enlaces legales",
      type: "array",
      of: [{ type: "navLink" }],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Configuración del sitio" };
    },
  },
});
