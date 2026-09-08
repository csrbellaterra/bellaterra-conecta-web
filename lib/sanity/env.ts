export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";

/**
 * Antes de crear un proyecto en sanity.io, projectId está vacío. Todo
 * el sitio debe poder arrancar y compilar en ese estado, sirviendo
 * los datos locales de respaldo (ver lib/sanity/seed-data.ts) — así
 * el primer `pnpm build` no depende de tener ya Sanity configurado.
 */
export const isSanityConfigured = Boolean(projectId);

export function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }
  return v;
}
