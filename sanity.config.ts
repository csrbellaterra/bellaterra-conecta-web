/**
 * Configuración de Sanity Studio, embebido en /studio (ver
 * app/studio/[[...tool]]/page.tsx). No hace falta `sanity init`: este
 * archivo + esa ruta ya definen un Studio completo.
 *
 * Antes de que Aleix cree su proyecto real en sanity.io, projectId
 * está vacío (ver lib/sanity/env.ts) y esta pantalla no funcionará
 * hasta rellenar NEXT_PUBLIC_SANITY_PROJECT_ID en .env.local — el
 * resto del sitio (con datos locales de respaldo) sigue funcionando
 * igualmente. Ver README.md, sección "Configurar Sanity".
 */
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId } from "@/lib/sanity/env";
import { schemaTypes } from "@/sanity/schemaTypes";
import { structure } from "@/sanity/structure.config";

export default defineConfig({
  name: "bellaterra-conecta",
  title: "Bellaterra Conecta — Contenido",
  basePath: "/studio",
  projectId: projectId || "placeholder",
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({ structure }),
    // Visual Editing: permite editar haciendo clic directamente sobre
    // la web en vivo (previsualización) en vez de solo desde el panel.
    presentationTool({
      previewUrl: {
        previewMode: {
          enable: "/api/draft-mode/enable",
        },
      },
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
