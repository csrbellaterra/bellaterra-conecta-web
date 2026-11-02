import type { Door, DoorId, SanityImage } from "@/types/content";

/**
 * Sustituciones visuales desde el código, sin tocar los documentos de Sanity.
 *
 * Algunas fotos antiguas publicadas en Sanity muestran personas sin
 * autorización confirmada o son de banco de imágenes (no la finca). Mientras
 * no se cambien en el Studio, se sustituyen al pintar la página por fotos
 * reales ya aprobadas: las del vídeo de la Home (public/images/aprobadas) y
 * los portales de la Home para las tarjetas de experiencias relacionadas.
 *
 * Para retirar una sustitución basta con quitar su id de BLOCKED cuando la
 * foto de Sanity se haya cambiado o autorizado.
 */

const approved = (name: string, alt: string): SanityImage => ({ url: `/images/aprobadas/${name}.jpg`, alt, width: 2000, height: 1333 });

// id del asset de Sanity → foto aprobada que se muestra en su lugar
const BLOCKED: Record<string, SanityImage> = {
  // Eventos · Cumpleaños: caras reconocibles
  da1f5388bccf4f088d9d7ce10d3b091077fd769d: approved("finca-04", "Piscina con tumbonas, zona de barbacoa y pérgola entre pinos"),
  // Eventos · Aniversarios: bañistas
  "426c9e7e8ec807bde4523132d675e183a401c350": approved("finca-07", "Porche de piedra con mesa bajo la fachada de la casa"),
  // Eventos · Celebraciones familiares: banco de imágenes
  f07aadbf6ffc725028aa1a8c6a6d4af0268e51da: approved("finca-06", "Jardín con césped y porche con buganvilla junto a la casa"),
  // Eventos · Comuniones: banco de imágenes
  "8a43583d93a05310106cead9f7c98acd22052565": approved("finca-10", "Terraza cubierta con toldo y mesas junto a la fachada blanca"),
  // Fiesta en la piscina (tarjeta de Eventos en otras páginas): bañistas reconocibles
  "4fdc85e1f841cf4d2dfc5a9c99249dcacf14750d": approved("finca-04", "Piscina con tumbonas, zona de barbacoa y pérgola entre pinos"),
  // Comunidad · Family Days: jugadores en primer plano
  "8398acaf6a74f545f9d4444c7d90a2237fa693c6": approved("finca-13", "Pistas de pickleball con vistas a la sierra"),
  // Exterior con pistas y personas (tarjeta de Comunidad en otras páginas)
  "96ddddc02a5d847e9fc3d51e4fa70577e0621901": approved("finca-13", "Pistas de pickleball con vistas a la sierra"),
};

/** Portales aprobados de la Home: foto de cada experiencia en las tarjetas relacionadas. */
const PORTAL_IMAGES: Partial<Record<DoorId, SanityImage>> = {
  empresas: { url: "/images/home/portales/empresas.jpg", alt: "", width: 1500, height: 2000 },
  eventos: { url: "/images/home/portales/eventos.jpg", alt: "", width: 1500, height: 2000 },
  estancias: { url: "/images/home/portales/estancias.jpg", alt: "", width: 2000, height: 1333, hotspot: { x: 25, y: 50 } },
  comunidad: { url: "/images/home/portales/comunidad.jpg", alt: "", width: 2000, height: 1500 },
};

function blockedReplacement(url: string): SanityImage | undefined {
  const id = /\/([0-9a-f]{40})-\d+x\d+\./.exec(url)?.[1];
  return id ? BLOCKED[id] : undefined;
}

/** Copia del valor con cada imagen bloqueada sustituida (recorre todo el documento). */
export function withApprovedImages<T>(value: T): T {
  if (Array.isArray(value)) return value.map(withApprovedImages) as T;
  if (!value || typeof value !== "object") return value;
  const record = value as Record<string, unknown>;
  if (typeof record.url === "string") {
    const replacement = blockedReplacement(record.url);
    if (replacement) return replacement as T;
  }
  return Object.fromEntries(Object.entries(record).map(([k, v]) => [k, withApprovedImages(v)])) as T;
}

/** Puertas para las tarjetas relacionadas, con la foto del portal aprobado. */
export function withPortalImages(doors: Door[]): Door[] {
  return doors.map((d) => {
    const portal = PORTAL_IMAGES[d.id];
    return portal ? { ...withApprovedImages(d), selectorImage: portal } : withApprovedImages(d);
  });
}
