import { defineField, defineType } from "sanity";

/**
 * Objeto de media "V2", más completo que el `mediaField` original
 * (que se mantiene sin tocar porque ya hay documentos reales
 * publicados que lo usan — ver lib/sanity/env.ts / seed-data.ts).
 *
 * Se usa en TODOS los campos visuales nuevos de la V2: soporta
 * imagen, vídeo subido o vídeo externo, con variante específica para
 * móvil y poster de vídeo. Ninguna sección nueva debe hardcodear una
 * imagen en el componente — todo pasa por este objeto.
 */
export default defineType({
  name: "media",
  title: "Media",
  type: "object",
  fields: [
    defineField({
      name: "mediaType",
      title: "Tipo",
      type: "string",
      options: {
        list: [
          { title: "Imagen", value: "image" },
          { title: "Vídeo subido", value: "uploadedVideo" },
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
      hidden: ({ parent }) => parent?.mediaType !== "image",
    }),
    defineField({
      name: "videoFile",
      title: "Vídeo (archivo subido)",
      type: "file",
      options: { accept: "video/*" },
      hidden: ({ parent }) => parent?.mediaType !== "uploadedVideo",
    }),
    defineField({
      name: "externalVideoUrl",
      title: "URL de vídeo externo",
      type: "url",
      description: "Vídeo alojado fuera de Sanity (Mux, Cloudinary, un dron en Vimeo, etc.).",
      hidden: ({ parent }) => parent?.mediaType !== "externalVideo",
    }),
    defineField({
      name: "poster",
      title: "Imagen de portada del vídeo (poster)",
      type: "imageWithAlt",
      description: "Se muestra mientras el vídeo carga, o como imagen de respaldo si no puede reproducirse.",
      hidden: ({ parent }) => parent?.mediaType === "image",
    }),
    defineField({
      name: "mobileImage",
      title: "Imagen para móvil (opcional)",
      type: "imageWithAlt",
      description: "Sustituye a la imagen principal en pantallas estrechas. Si se deja vacío, se usa la imagen principal.",
    }),
    defineField({
      name: "mobileVideo",
      title: "Vídeo para móvil (opcional)",
      type: "file",
      options: { accept: "video/*" },
      description: "Sustituye al vídeo principal en pantallas estrechas (útil para servir un archivo más ligero). Si se deja vacío, se usa el vídeo principal.",
    }),
    defineField({
      name: "caption",
      title: "Pie de foto (opcional)",
      type: "string",
    }),
    defineField({
      name: "autoplay",
      title: "Reproducir vídeo automáticamente",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "loop",
      title: "Repetir vídeo en bucle",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: { type: "mediaType", media: "image", caption: "caption" },
    prepare({ type, media, caption }) {
      return { title: caption || `Media (${type || "imagen"})`, media };
    },
  },
});
