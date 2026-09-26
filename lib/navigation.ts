import type { DoorId } from "@/types/content";

/**
 * Estructura de navegación V2 (sección 6 del prompt de rediseño):
 * Bellaterra Conecta | Experiencias ▾ (Empresas/Eventos/Estancias/
 * Comunidad/Pickleball) | Nuestra historia | Impacto | Galería |
 * Contacto.
 *
 * Este módulo es solo la fuente de verdad de las rutas/etiquetas —
 * no sustituye a siteSettings.navigation (fuente actual del Header
 * V1, que sigue funcionando sin cambios). El nuevo Header con
 * desplegable "Experiencias" (Fase 2) importará esto en vez de leer
 * un menú plano desde Sanity, para poder construir el desplegable sin
 * depender de que el contenido de siteSettings se actualice primero.
 */

export const EXPERIENCE_LINKS: { label: string; slug: DoorId; url: string }[] = [
  { label: "Empresas", slug: "empresas", url: "/empresas" },
  { label: "Eventos", slug: "eventos", url: "/eventos" },
  { label: "Estancias", slug: "estancias", url: "/estancias" },
  { label: "Comunidad", slug: "comunidad", url: "/comunidad" },
  { label: "Pickleball", slug: "pickleball", url: "/pickleball" },
];

/**
 * Lista completa de la navegación (incluye enlaces todavía no
 * visibles públicamente, ej. Galería). Se mantiene aquí para que la
 * arquitectura de navegación quede preparada — usar
 * VISIBLE_NAV_LINKS más abajo para renderizar el menú real.
 */
export const MAIN_NAV_LINKS = [
  { label: "Experiencias", url: "/experiencias", children: EXPERIENCE_LINKS },
  // "Nuestra historia" apunta temporalmente a /la-finca: es el mismo
  // contenido, en la URL antigua. La migración real a /nuestra-historia
  // (con su propio diseño) se hace en Fase 4 — en ese momento se
  // actualiza este enlace y se reactiva el redirect en next.config.mjs.
  { label: "Nuestra historia", url: "/la-finca" },
  { label: "Impacto", url: "/impacto" },
  // /galeria todavía no existe como página (Fase 5). Se mantiene
  // preparada en la arquitectura pero oculta de la navegación pública
  // (ver hidden: true y VISIBLE_NAV_LINKS) para no mostrar un enlace
  // que hoy daría 404. Se reactiva quitando `hidden` cuando exista la
  // página.
  { label: "Galería", url: "/galeria", hidden: true },
  { label: "Contacto", url: "/contacto" },
] as const;

/**
 * Lo que el Header (desktop y móvil) debe renderizar realmente —
 * excluye los enlaces marcados `hidden`. Úsalo siempre en vez de
 * MAIN_NAV_LINKS directamente en componentes de navegación.
 */
export const VISIBLE_NAV_LINKS = MAIN_NAV_LINKS.filter((link) => !("hidden" in link && link.hidden));
