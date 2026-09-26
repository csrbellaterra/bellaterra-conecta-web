import { defineField, defineType } from "sanity";

/**
 * Campo de media flexible: imagen, vídeo subido o vídeo externo
 * (ej. Mux/Cloudinary). Usado en Hero, ImageText, Experience,
 * FullWidthMedia, etc. — cualquier sitio donde en el futuro se quiera
 * poner un vídeo (por ejemplo, un vídeo de Higgsfield para el hero)
 * sin cambiar el schema.
 */
export default defineType({
  name: "mediaField",
  title: "Media",
  type: "object",
  fields: [
    defineField({
      name: "type",
      title: "Tipo",
      type: "string",
      options: {
        list: [
          { title: "Imagen", value: "image" },
          { title: "Vídeo subido", value: "video" },
          { title: "Vídeo externo (URL)", value: "externalVideo" },
        ],
        layout: "radio",
      },
      initialValue: "image",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Imagen",
      type: "imageWithAlt",
      hidden: ({ parent }) => parent?.type !== "image",
    }),
    defineField({
      name: "video",
      title: "Vídeo (archivo)",
      type: "file",
      options: { accept: "video/*" },
      hidden: ({ parent }) => parent?.type !== "video",
    }),
    defineField({
      name: "externalVideoUrl",
      title: "URL de vídeo externo",
      type: "url",
      description: "Ej. un vídeo alojado en Mux, Cloudinary o similar.",
      hidden: ({ parent }) => parent?.type !== "externalVideo",
    }),
    defineField({
      name: "poster",
      title: "Imagen de portada del vídeo (poster)",
      type: "imageWithAlt",
      description: "Se muestra mientras el vídeo carga o si no puede reproducirse.",
      hidden: ({ parent }) => parent?.type === "image",
    }),
    defineField({
      name: "mobileImage",
      title: "Imagen para móvil (opcional, V2)",
      type: "imageWithAlt",
      description: "Sustituye a la imagen principal en pantallas estrechas. Si se deja vacío, se usa la imagen principal.",
      hidden: ({ parent }) => parent?.type !== "image",
    }),
    defineField({
      name: "mobileVideo",
      title: "Vídeo para móvil (opcional, V2)",
      type: "file",
      options: { accept: "video/*" },
      description: "Sustituye al vídeo principal en pantallas estrechas. Si se deja vacío, se usa el vídeo principal.",
      hidden: ({ parent }) => parent?.type === "image",
    }),
    defineField({
      name: "autoplay",
      title: "Reproducir vídeo automáticamente (V2)",
      type: "boolean",
      initialValue: true,
      hidden: ({ parent }) => parent?.type === "image",
    }),
    defineField({
      name: "loop",
      title: "Repetir vídeo en bucle (V2)",
      type: "boolean",
      initialValue: true,
      hidden: ({ parent }) => parent?.type === "image",
    }),
  ],
  preview: {
    select: { type: "type", media: "image" },
    prepare({ type, media }) {
      return { title: `Media (${type || "imagen"})`, media };
    },
  },
});
