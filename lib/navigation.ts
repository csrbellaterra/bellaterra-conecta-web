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
 * Lista completa de la navegación. Puede incluir enlaces marcados
 * `hidden` mientras su página todavía no existe — usar
 * VISIBLE_NAV_LINKS más abajo para renderizar el menú real. Galería
 * (Fase 5) ya es una página funcional y se muestra aquí sin `hidden`.
 */
export const MAIN_NAV_LINKS = [
  { label: "Experiencias", url: "/experiencias", children: EXPERIENCE_LINKS },
  { label: "Nuestra historia", url: "/nuestra-historia" },
  { label: "Impacto", url: "/impacto" },
  { label: "Galería", url: "/galeria" },
  { label: "Contacto", url: "/contacto" },
] as const;

/**
 * Lo que el Header (desktop y móvil) debe renderizar realmente —
 * excluye los enlaces marcados `hidden`. Úsalo siempre en vez de
 * MAIN_NAV_LINKS directamente en componentes de navegación.
 */
export const VISIBLE_NAV_LINKS = MAIN_NAV_LINKS.filter((link) => !("hidden" in link && link.hidden));
