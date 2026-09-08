/**
 * Ruta catch-all que embebe Sanity Studio en /studio.
 *
 * Este archivo se queda como Server Component a propósito: es el
 * único sitio donde Next.js permite exportar `metadata`/`viewport`
 * (no se puede hacer desde un Client Component). El propio Studio
 * — que sí necesita ser cliente, ver StudioClient.tsx — se renderiza
 * dentro de un componente aparte marcado "use client".
 */
import StudioClient from "./StudioClient";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <StudioClient />;
}
