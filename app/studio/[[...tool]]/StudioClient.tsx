"use client";

/**
 * Componente cliente que carga y renderiza Sanity Studio.
 *
 * Por qué existe este archivo separado: si `sanity.config.ts` (y sus
 * plugins — structureTool, presentationTool, visionTool) se importan
 * desde un Server Component, Next.js puede intentar resolver React
 * usando las condiciones de "react-server", que no exponen
 * `createContext` y otras APIs que Sanity UI necesita — de ahí el
 * error "createContext is not a function" en /studio. Al marcar ESTE
 * archivo como "use client" y mover aquí tanto el import de
 * `sanity.config` como el de `NextStudio`, todo ese árbol de módulos
 * se resuelve siempre dentro del bundle de cliente, nunca en el de
 * servidor.
 *
 * page.tsx (Server Component) solo importa este componente — así
 * `metadata`/`viewport` pueden seguir exportándose desde page.tsx,
 * algo que Next.js no permite hacer desde un Client Component.
 */
import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

export default function StudioClient() {
  return <NextStudio config={config} />;
}
