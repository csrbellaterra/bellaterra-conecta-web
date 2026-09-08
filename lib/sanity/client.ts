import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

// Cliente para lecturas públicas (contenido publicado). useCdn=true en
// producción para servir desde el CDN de Sanity; en dev preferimos
// datos frescos.
export const client = createClient({
  projectId: projectId || "placeholder",
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
  perspective: "published",
});

// Cliente con token de lectura, para contenido en borrador (Visual
// Editing / Presentation). Solo se usa en server components/rutas que
// explícitamente pidan modo preview.
export const previewClient = createClient({
  projectId: projectId || "placeholder",
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
  perspective: "previewDrafts",
});

export function getClient(preview = false) {
  return preview ? previewClient : client;
}
