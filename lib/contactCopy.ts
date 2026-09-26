import type { ContactIntent } from "@/types/content";

/**
 * Fallback de /contacto (Fase 5, corrección posterior). Fuente
 * principal: el documento Sanity `contactPage` (ver
 * sanity/schemaTypes/documents/contactPage.ts y
 * lib/content.ts → getContactPage). Esto solo se usa si Sanity no
 * está configurado o si el documento todavía no tiene `intents`
 * cargados — mismo patrón de fallback que lib/doorCopy.ts.
 *
 * La forma coincide exactamente con `ContactIntent`
 * (types/content.ts) para que ContactIntentRouter pueda mezclar
 * Sanity y fallback campo a campo sin dos formas de datos distintas.
 */

export const CONTACT_HERO_EYEBROW = "CONTACTO";
export const CONTACT_HERO_HEADLINE = "¿Qué te gustaría hacer en Bellaterra Conecta?";
export const CONTACT_HERO_BODY = "Cuéntanos qué te trae hasta aquí y te llevamos al lugar adecuado.";

export const CONTACT_INTENT_OPTIONS: ContactIntent[] = [
  {
    id: "empresas",
    title: "Organizar algo de empresa",
    description: "Reuniones, formaciones, presentaciones o jornadas de equipo fuera de la oficina.",
    url: "/solicitud/empresas",
    order: 1,
    enabled: true,
  },
  {
    id: "eventos",
    title: "Celebrar un evento",
    description: "Cumpleaños, aniversarios, comuniones y otras celebraciones en la finca.",
    url: "/solicitud/eventos",
    order: 2,
    enabled: true,
  },
  {
    id: "estancias",
    title: "Alojarme unos días",
    description: "Habitación privada, alojamiento junto a un evento o la finca en exclusiva.",
    url: "/solicitud/estancias",
    order: 3,
    enabled: true,
  },
  {
    id: "comunidad",
    title: "Unirme a la Comunidad",
    description: "Jornadas abiertas, Family Day y encuentros para conocer el proyecto.",
    url: "/solicitud/comunidad",
    order: 4,
    enabled: true,
  },
  {
    id: "pickleball",
    title: "Jugar a pickleball",
    description: "Reserva de pistas y actividades organizadas.",
    url: "/solicitud/pickleball",
    order: 5,
    enabled: true,
  },
  {
    id: "visita",
    title: "Venir a conocer la finca",
    description: "Una visita, sin necesidad de tener claro todavía qué puerta te interesa.",
    url: "/solicitud/general?ctaSource=visita",
    order: 6,
    enabled: true,
  },
  {
    id: "otra-cosa",
    title: "Otra cosa",
    description: "Tengo otra consulta.",
    url: "/solicitud/general?ctaSource=contacto-general",
    order: 7,
    enabled: true,
  },
];
