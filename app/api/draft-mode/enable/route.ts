import { defineEnableDraftMode } from "next-sanity/draft-mode";

import { previewClient } from "@/lib/sanity/client";

/**
 * Activa el modo borrador de Next.js para que Sanity Presentation
 * pueda mostrar contenido sin publicar. Requiere
 * SANITY_API_READ_TOKEN configurado en .env.local (ver README.md).
 */
export const { GET } = defineEnableDraftMode({ client: previewClient });
