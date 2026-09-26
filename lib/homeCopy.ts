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
