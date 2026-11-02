import type { DoorId } from "@/types/content";

/**
 * FALLBACK del copy de la Home V2 — NO es la fuente de verdad.
 *
 * La fuente de verdad es Sanity: `homePage` (selectorIntroduction,
 * connectionEyebrow/Headline, plastyEyebrow/Headline/Body/CtaLabel/
 * CtaUrl, finalCtaEyebrow/Headline/Body/Label/Form/Url) y `door`
 * (homeEyebrow, homeHeadline, homeDescription, homeCtaLabel,
 * homeMedia) — ver sanity/schemaTypes/documents/homePage.ts y door.ts.
 *
 * Este archivo solo se usa cuando el campo correspondiente todavía no
 * se ha rellenado en Sanity (documentos existentes, creados antes de
 * que estos campos existieran). En cuanto se rellena un campo desde
 * el Studio, ese valor de Sanity prevalece siempre — ver los
 * componentes de components/sections/Home*.tsx y app/page.tsx, que
 * hacen `sanityValue || FALLBACK` campo a campo.
 *
 * El texto de aquí es exactamente el copy aprobado en el prompt de
 * rediseño V2 (secciones 4–11), para que la Home se vea completa y
 * correcta incluso antes de rellenar nada en el Studio.
 */
export const HOME_DOOR_COPY: Record<
  DoorId,
  { eyebrow: string; headline: string; body: string; ctaLabel: string }
> = {
  empresas: {
    eyebrow: "REUNIRSE, TRABAJAR Y CONECTAR",
    headline: "Salir de la oficina\ncambia la conversación.",
    body: "Reuniones, formaciones, workshops y jornadas de equipo en un entorno diferente, combinando trabajo, restauración, aire libre y pickleball.",
    ctaLabel: "Descubre Empresas",
  },
  eventos: {
    eyebrow: "CELEBRAR Y COMPARTIR",
    headline: "Un lugar para celebrar.",
    body: "Cumpleaños, aniversarios y encuentros en una finca privada donde interior y exterior forman parte de la misma experiencia.",
    ctaLabel: "Descubre Eventos",
  },
  estancias: {
    eyebrow: "QUEDARTE Y DISFRUTAR LA FINCA",
    headline: "Quédate un poco más.",
    body: "Una habitación, una noche después de una celebración o la posibilidad de disfrutar la finca con más tiempo y privacidad.",
    ctaLabel: "Descubre las estancias",
  },
  comunidad: {
    eyebrow: "JORNADAS ABIERTAS, DEPORTE Y CONVIVENCIA",
    headline: "Hay lugares a los que vuelves.",
    body: "Jornadas abiertas, encuentros, deporte y actividades para descubrir Bellaterra Conecta, conocer a otras personas y mantener una relación con el proyecto.",
    ctaLabel: "Conoce la Comunidad",
  },
  pickleball: {
    eyebrow: "JUGAR, COMPARTIR Y DISFRUTAR",
    headline: "Juega. Comparte. Conecta.",
    body: "Tres pistas para reservar, jugar y participar en actividades como los Family Days.",
    ctaLabel: "Descubre Pickleball",
  },
};

export const HOME_SELECTOR_COPY = {
  heading: "¿Qué te gustaría hacer aquí?",
  introduction:
    "Bellaterra Conecta reúne distintas experiencias en una misma finca. Encuentra la que te trae hasta aquí y descubre todo lo demás.",
};

export const HOME_CONNECTION_COPY = {
  heading: "Cinco formas de entrar.\nUn mismo lugar al que volver.",
};

export const HOME_PLASTY_COPY = {
  eyebrow: "PLASTY",
  heading: "Cada experiencia cuenta.",
  body: "PLASTY transforma las experiencias de Bellaterra Conecta en contribuciones destinadas a financiar la recuperación y el reciclaje de plástico.",
  ctaLabel: "Conoce nuestro impacto",
  ctaUrl: "/impacto",
};

export const HOME_FINAL_CTA_COPY = {
  heading: "¿Hablamos de tu próxima visita a Bellaterra?",
  body: "Cuéntanos qué te trae hasta aquí.",
  ctaLabel: "Escríbenos",
  ctaUrl: "/solicitud/general",
};

/* ============================================
   HOME V2 — CUATRO EXPERIENCIAS (decisión definitiva 31/10/2026)
   ============================================ */

/** Las cuatro puertas principales. Pickleball sigue existiendo como
 * página (/pickleball) pero ya no es una de las experiencias. */
export const PRIMARY_DOOR_IDS = ["empresas", "eventos", "estancias", "comunidad"] as const;
export type PrimaryDoorId = (typeof PRIMARY_DOOR_IDS)[number];

export const HOME_V2_COPY = {
  heroTitle: "Una finca, diferentes formas de vivirla",
  heroCtaLabel: "Explorar experiencias",
  heroCtaUrl: "#experiencias",
  portalsHeading: "¿Qué te gustaría vivir aquí?",
  portalsIntroduction: "Un mismo lugar. Cuatro experiencias diferentes.",
  identityHeadline: "Cuatro formas de entrar.\nUn mismo lugar al que volver.",
  seoTitle: "Bellaterra Conecta — Una finca, diferentes formas de vivirla",
  seoDescription:
    "Finca en Bellaterra, Barcelona, para empresas, eventos, estancias y comunidad. Cuatro formas de entrar, un mismo lugar al que volver.",
};

/** Descripción corta de cada portal (fallback de door.eyebrow). */
export const HOME_PORTAL_COPY: Record<PrimaryDoorId, { description: string }> = {
  empresas: { description: "Reunirse, trabajar y conectar equipos." },
  eventos: { description: "Celebrar y compartir momentos especiales." },
  estancias: { description: "Quedarte y disfrutar la finca." },
  comunidad: { description: "Participar, conectar y volver." },
};

/**
 * Textos que hoy siguen en Sanity con el modelo de CINCO puertas.
 * Mientras no se ejecute `pnpm sanity:align-home-v2` (que actualiza
 * esos campos en Sanity, y que solo debe ejecutarse al publicar la
 * V2 porque la web de producción lee el mismo dataset), la rama V2
 * los trata como vacíos y usa el copy V2. Cualquier otro valor que se
 * escriba en Sanity prevalece siempre.
 */
const LEGACY_V1_VALUES = new Set([
  // Titular V2 anterior (sustituido el 02/11/2026).
  "Una finca. Cuatro formas de vivirla.",
  "Bellaterra Conecta — Una finca. Cuatro formas de vivirla.",
  "¿Qué te gustaría hacer aquí?",
  "Bellaterra Conecta reúne distintas experiencias en una misma finca. Encuentra la que te trae hasta aquí y descubre todo lo demás.",
  "Descubre la finca",
  "#selector",
  "Reunirse, trabajar y conectar",
  "Celebrar y compartir",
  "Jornadas abiertas con actividades de deporte, convivencia y participación para descubrir Bellaterra Conecta",
]);

export function v2Copy(value: string | null | undefined, fallback: string): string {
  const text = value?.trim();
  if (!text || /\bcinco\b/i.test(text) || LEGACY_V1_VALUES.has(text)) return fallback;
  return text;
}
