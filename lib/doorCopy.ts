import type { DoorId } from "@/types/content";

/**
 * FALLBACK del copy de las páginas de puerta rediseñadas en Fase 3
 * (Empresas, Eventos) y Fase 4A (Estancias, Comunidad) — NO es la
 * fuente de verdad.
 *
 * La fuente de verdad es Sanity: los campos heroEyebrow/heroHeadline/
 * heroDescription/primaryCtaLabel/featuresTitle/timelineTitle/
 * timelineItems/spacesTitle/finalCtaHeadline/finalCtaBody/finalCtaLabel/
 * finalCtaForm/featureSections/spacesGallery/relatedExperiences de
 * `door` (ver sanity/schemaTypes/documents/door.ts) — campos genéricos,
 * válidos para cualquier puerta, no solo Empresas/Eventos. Este archivo
 * solo se usa campo a campo cuando el correspondiente todavía está
 * vacío en un documento ya publicado — en cuanto se rellena desde
 * /studio, ese valor prevalece siempre (ver components/sections/door/*
 * y components/DoorPageTemplateV2.tsx, que hacen `sanityValue ||
 * FALLBACK` campo a campo, igual que lib/homeCopy.ts para la Home).
 */

type DoorPageCopy = {
  hero: { eyebrow: string; headline: string; description: string; ctaLabel: string };
  featureSectionsHeading: string;
  featureItemsFallback: { title: string; body: string; ctaLabel?: string; ctaUrl?: string }[];
  timeline: { title: string; items: { time: string; title: string; body?: string }[] };
  spaces: { title: string; itemsFallback: string[] };
  plasty: { heading: string; body: string; ctaLabel: string };
  finalCta: { headline: string; body: string; ctaLabel: string };
  related: { doorId: DoorId; note: string }[];
};

/** Puertas que ya usan este sistema de copy editorial V2 (Fase 3 + 4A + 4B). */
export type DoorCopyId = "empresas" | "eventos" | "estancias" | "comunidad" | "pickleball";

export const DOOR_PAGE_COPY: Record<DoorCopyId, DoorPageCopy> = {
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
  estancias: {
    hero: {
      eyebrow: "ESTANCIAS",
      headline: "Alójate y descubre\nBellaterra Conecta desde dentro.",
      description: "Quédate. Descansa. Disfruta la finca a otro ritmo.",
      ctaLabel: "CONSULTA DISPONIBILIDAD",
    },
    featureSectionsHeading: "Tres maneras de quedarse",
    featureItemsFallback: [
      { title: "Habitación privada", body: "Reserva una habitación a través de la plataforma habitual." },
      { title: "Alojamiento vinculado a una experiencia", body: "Quédate antes o después de una jornada, evento o Family Day." },
      { title: "Estancia privada", body: "La casa y la finca en exclusiva para los huéspedes registrados." },
    ],
    timeline: {
      title: "Vivir la finca\ncon más tiempo.",
      items: [
        { time: "01", title: "Jardín", body: "Espacio abierto para pasear y desconectar." },
        { time: "02", title: "Piscina", body: "Disponible para huéspedes durante la estancia." },
        { time: "03", title: "Espacios comunes", body: "Zonas compartidas de la finca, a otro ritmo." },
        { time: "04", title: "Descanso", body: "Habitaciones pensadas para quedarte más tiempo." },
      ],
    },
    spaces: {
      title: "Habitaciones y espacios",
      itemsFallback: ["Habitaciones", "Baños", "Vistas", "Piscina", "Espacios comunes"],
    },
    plasty: {
      heading: "Vuestra estancia también genera impacto.",
      body: "Cada noche en habitación individual o Airbnb está vinculada a la financiación de la recuperación de 2 kg de plástico. El alquiler de la casa completa está vinculado a 30 kg por experiencia. El modelo se sigue afinando.",
      ctaLabel: "Conoce PLASTY",
    },
    finalCta: {
      headline: "¿Cuándo te quedas?",
      body: "Consulta disponibilidad y te ayudamos a elegir la mejor forma de alojarte.",
      ctaLabel: "CONSULTA DISPONIBILIDAD",
    },
    related: [
      { doorId: "eventos", note: "¿Quieres celebrar algo mientras estás aquí?" },
      { doorId: "comunidad", note: "Conoce la Comunidad" },
    ],
  },
  comunidad: {
    hero: {
      eyebrow: "COMUNIDAD",
      headline: "Hay lugares\na los que vuelves.",
      description:
        "Comunidad es la forma de mantener una relación con Bellaterra Conecta más allá de una reserva puntual.",
      ctaLabel: "FORMA PARTE DE LA COMUNIDAD",
    },
    featureSectionsHeading: "Cómo participar",
    featureItemsFallback: [
      { title: "Family Days", body: "Jornadas abiertas para descubrir la finca a través del deporte y la convivencia." },
      { title: "Encuentros y actividades", body: "Citas puntuales para conocer a otras personas de la Comunidad." },
      { title: "Vinculación con la Comunidad", body: "Una forma de mantener el vínculo con Bellaterra Conecta en el tiempo." },
    ],
    // No usado en la plantilla actual de Comunidad (sin sección de timeline propia) —
    // se deja definido por si una futura revisión decide incorporarlo.
    timeline: {
      title: "Deporte, convivencia\ny participación.",
      items: [
        { time: "01", title: "Pickleball", body: "Iniciación, práctica y pequeños campeonatos." },
        { time: "02", title: "Convivencia", body: "Espacios compartidos entre jornadas." },
      ],
    },
    spaces: {
      title: "Deporte, convivencia y actividades",
      itemsFallback: ["Pickleball", "Encuentros", "Actividades familiares", "Convivencia"],
    },
    // No usado en la plantilla actual de Comunidad (sin bloque PLASTY: el modelo de
    // vinculación todavía no está definido) — se deja el tipo completo por consistencia.
    plasty: {
      heading: "La Comunidad también genera impacto.",
      body: "El modelo de vinculación con PLASTY para Comunidad todavía se está definiendo.",
      ctaLabel: "Conoce PLASTY",
    },
    finalCta: {
      headline: "¿Quieres formar parte?",
      body: "Apúntate a un Family Day o cuéntanos qué te interesa.",
      ctaLabel: "FORMA PARTE DE LA COMUNIDAD",
    },
    related: [
      { doorId: "pickleball", note: "Termina el día en la pista" },
      { doorId: "eventos", note: "¿Prefieres una celebración privada?" },
    ],
  },
  pickleball: {
    hero: {
      eyebrow: "PICKLEBALL",
      headline: "Juega.\nComparte.\nConecta.",
      description:
        "Tres pistas de pickleball en Bellaterra para jugar, participar en encuentros y disfrutar del deporte dentro de la finca.",
      ctaLabel: "RESERVA / JUEGA",
    },
    featureSectionsHeading: "Tres formas de vivir el pickleball",
    featureItemsFallback: [
      { title: "Reservar pista", body: "Para quienes quieren venir a jugar.", ctaLabel: "Reserva / solicita pista" },
      {
        title: "Family Days",
        body: "Jornadas abiertas que combinan pickleball, convivencia y otras actividades.",
        ctaLabel: "Ver próximos Family Days",
      },
      {
        title: "Grupos y encuentros",
        body: "Para empresas, grupos de amigos o experiencias organizadas.",
        ctaLabel: "Organiza una actividad",
      },
    ],
    // No usado en la plantilla actual de Pickleball (usa DoorUpcomingFamilyDays en
    // su lugar para la sección de Family Days) — se deja definido por consistencia.
    timeline: {
      title: "Juega.\nComparte.\nConecta.",
      items: [{ time: "01", title: "Pickleball", body: "Reserva, práctica y encuentros." }],
    },
    spaces: {
      title: "Tres pistas.\nUn entorno diferente.",
      itemsFallback: ["Las tres pistas", "Entorno natural", "Accesos", "Ambiente de juego"],
    },
    // No usado en la plantilla actual de Pickleball (sin bloque PLASTY: el modelo
    // antiguo de escuela/matrícula ya no existe y el nuevo aún no está definido,
    // ver CLAUDE.md) — se deja el tipo completo por consistencia.
    plasty: {
      heading: "Pickleball también forma parte del propósito PLASTY.",
      body: "El modelo de impacto para Pickleball todavía se está definiendo.",
      ctaLabel: "Conoce PLASTY",
    },
    finalCta: {
      headline: "Trae tu grupo a la pista.",
      body: "Pickleball también puede formar parte de una jornada de empresa, una celebración o una actividad en grupo dentro de Bellaterra Conecta.",
      ctaLabel: "ORGANIZA UNA ACTIVIDAD",
    },
    related: [
      { doorId: "empresas", note: "¿Vienes con tu equipo?" },
      { doorId: "comunidad", note: "¿Quieres descubrir un Family Day?" },
      { doorId: "eventos", note: "¿Celebras algo?" },
    ],
  },
};

export const DOOR_PAGE_HAZLO_TUYO = {
  headline: "Hazlo tuyo",
  body: "Cada evento puede combinar espacios, restauración, exterior, pickleball y alojamiento según vuestras necesidades y la época del año.",
  ctaLabel: "Diseña tu celebración",
};
