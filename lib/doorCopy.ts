import type { DoorId } from "@/types/content";

/**
 * FALLBACK del copy de las páginas de puerta rediseñadas en Fase 3
 * (por ahora solo Empresas y Eventos) — NO es la fuente de verdad.
 *
 * La fuente de verdad es Sanity: los campos heroEyebrow/heroHeadline/
 * heroDescription/primaryCtaLabel/featuresTitle/timelineTitle/
 * timelineItems/spacesTitle/finalCtaHeadline/finalCtaBody/finalCtaLabel/
 * finalCtaForm/featureSections/spacesGallery/relatedExperiences de
 * `door` (ver sanity/schemaTypes/documents/door.ts). Este archivo
 * solo se usa campo a campo cuando el correspondiente todavía está
 * vacío en un documento ya publicado — en cuanto se rellena desde
 * /studio, ese valor prevalece siempre (ver components/sections/door/*
 * y components/DoorPageTemplateV2.tsx, que hacen `sanityValue ||
 * FALLBACK` campo a campo, igual que lib/homeCopy.ts para la Home).
 */

type DoorPageCopy = {
  hero: { eyebrow: string; headline: string; description: string; ctaLabel: string };
  featureSectionsHeading: string;
  featureItemsFallback: { title: string; body: string }[];
  timeline: { title: string; items: { time: string; title: string; body?: string }[] };
  spaces: { title: string; itemsFallback: string[] };
  plasty: { heading: string; body: string; ctaLabel: string };
  finalCta: { headline: string; body: string; ctaLabel: string };
  related: { doorId: DoorId; note: string }[];
};

export const DOOR_PAGE_COPY: Record<"empresas" | "eventos", DoorPageCopy> = {
  empresas: {
    hero: {
      eyebrow: "EMPRESAS",
      headline: "Un espacio diferente\npara reunir y conectar equipos.",
      description:
        "Reuniones, formaciones, workshops y jornadas de equipo en un entorno que permite combinar trabajo, restauración, actividades al aire libre y pickleball.",
      ctaLabel: "ORGANIZA TU JORNADA",
    },
    featureSectionsHeading: "Qué puedes hacer aquí",
    featureItemsFallback: [
      { title: "REUNIRSE", body: "Reuniones, presentaciones y sesiones de trabajo." },
      { title: "CREAR", body: "Workshops, formaciones y jornadas estratégicas." },
      { title: "CONECTAR", body: "Restauración, exterior, actividades y pickleball." },
    ],
    timeline: {
      title: "Trabajo cuando toca.\nEspacio para conectar cuando importa.",
      items: [
        { time: "09:30", title: "Llegar y empezar" },
        { time: "11:00", title: "Workshop" },
        { time: "14:00", title: "Compartir mesa" },
        { time: "16:00", title: "Actividad / pickleball" },
      ],
    },
    spaces: { title: "Espacios", itemsFallback: ["Interior", "Terraza", "Jardín", "Comedor", "Piscina", "Pickleball"] },
    plasty: {
      heading: "Vuestra jornada también genera impacto.",
      body: "Cada jornada de empresa está vinculada a la financiación de la recuperación de 30 kg de plástico.",
      ctaLabel: "Conoce PLASTY",
    },
    finalCta: {
      headline: "¿Pensando en vuestra próxima jornada?",
      body: "Cuéntanos qué necesita vuestro equipo y preparamos una propuesta.",
      ctaLabel: "ORGANIZA TU JORNADA",
    },
    related: [
      { doorId: "estancias", note: "¿Os quedáis después?" },
      { doorId: "pickleball", note: "Termina la jornada en la pista" },
    ],
  },
  eventos: {
    hero: {
      eyebrow: "EVENTOS",
      headline: "Celebra momentos\nque dejan huella.",
      description: "Una finca privada para reunir a las personas que importan.",
      ctaLabel: "SOLICITA INFORMACIÓN",
    },
    featureSectionsHeading: "Qué puedes celebrar",
    featureItemsFallback: [
      { title: "Cumpleaños", body: "Celebra un año más rodeado de las personas que quieres." },
      { title: "Aniversarios", body: "Momentos para recordar, en un entorno único." },
      { title: "Celebraciones familiares", body: "Encuentros que reúnen a varias generaciones." },
      { title: "Comuniones", body: "Un día especial con espacio de sobra para todos." },
      { title: "Encuentros especiales", body: "Cualquier motivo para reunir a la gente que importa." },
    ],
    timeline: {
      title: "Un solo evento.\nDiferentes maneras de vivirlo.",
      items: [
        { time: "Interior", title: "Salas y comedor" },
        { time: "Terraza", title: "Aperitivo y sobremesa" },
        { time: "Jardín", title: "Ceremonia o cóctel" },
        { time: "Piscina", title: "Ambiente y descanso" },
        { time: "Barbacoa", title: "Comida al aire libre" },
      ],
    },
    spaces: { title: "Un evento, diferentes espacios", itemsFallback: ["Interior", "Terraza", "Jardín", "Piscina", "Barbacoa"] },
    plasty: {
      heading: "Vuestra celebración también genera impacto.",
      body: "Cada evento reservado está vinculado a la financiación de la recuperación de 70 kg de plástico.",
      ctaLabel: "Conoce PLASTY",
    },
    finalCta: {
      headline: "¿Tienes una fecha en mente?",
      body: "Cuéntanos cómo imaginas tu celebración.",
      ctaLabel: "SOLICITA INFORMACIÓN",
    },
    related: [
      { doorId: "estancias", note: "¿Te quedas a dormir?" },
      { doorId: "pickleball", note: "¿Quieres añadir una actividad?" },
    ],
  },
};

export const DOOR_PAGE_HAZLO_TUYO = {
  headline: "Hazlo tuyo",
  body: "Cada evento puede combinar espacios, restauración, exterior, pickleball y alojamiento según vuestras necesidades y la época del año.",
  ctaLabel: "Diseña tu celebración",
};
