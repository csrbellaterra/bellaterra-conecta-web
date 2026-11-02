import type { CinematicMotion, Door, DoorId, MediaField, SanityImage } from "@/types/content";
import type { IntroScene, SceneReview } from "@/lib/cinematic";
import { INTRO_PLACEHOLDERS } from "@/lib/introPlaceholders";

export { PORTRAIT_MEDIA, type IntroScene } from "@/lib/cinematic";

/**
 * Páginas de experiencia V2 (bloques A, B y C, ver
 * docs/fase-cinematica/ARQUITECTURA_PUERTAS_SCROLL.md).
 *
 * FALLBACK aprobado en código, igual que lib/doorCopy.ts y lib/homeCopy.ts:
 * la fuente de verdad es Sanity (door.cinematicIntro, featureSections,
 * spacesGallery, finalCta*…). Este archivo solo se usa campo a campo
 * mientras el campo está vacío en Sanity o contiene material heredado de
 * la V1 (textos y fotos que ya no representan la web actual).
 *
 * Fotos de las introducciones: derivados web de «Fotos Casa\SELECCION FOTOS
 * PUERTAS» (02/11/2026) y de las fotos ya aprobadas del 30/10 y del vídeo de
 * la Home, recortados por escena para escritorio (16:10) y móvil (3:5), con
 * anchos estáticos (scratchpad anchos.py). Los originales no se tocan.
 */

type DoorExperience = {
  /** CTA principal de la puerta (bloques A y C) */
  ctaLabel: string;
  scenes: IntroScene[];
  /**
   * Portada editorial (una foto, sin recorrido por scroll) mientras la puerta
   * no tenga al menos MIN_FILM_SCENES escenas publicables.
   */
  cover?: IntroScene;
  /** Solo Empresas usa todavía el bloque B nuevo (DoorExperienceTemplate). */
  formats?: { title: string; body: string }[];
  spaces?: { title: string; body?: string; image: SanityImage }[];
  related?: { doorId: DoorId; note: string }[];
};

/**
 * Escena con sus dos recortes, `/images/experiencias/<puerta>/<nombre>-desktop|mobile.jpg`,
 * y los anchos estáticos generados a su lado (-1280, -1920 y -750).
 */
function scene(
  door: DoorId,
  name: string,
  alt: string,
  text: { eyebrow?: string; title: string; body?: string },
  motion: CinematicMotion,
  review?: SceneReview
): IntroScene {
  const base = `/images/experiencias/${door}/${name}`;
  const desktop = `${base}-desktop.jpg`;
  const mobile = `${base}-mobile.jpg`;
  return {
    image: { url: desktop, alt, width: 2400, height: 1500 },
    mobileImage: { url: mobile, alt, width: 1200, height: 2000 },
    srcSet: {
      desktop: `${base}-desktop-1280.jpg 1280w, ${base}-desktop-1920.jpg 1920w, ${desktop} 2400w`,
      mobile: `${base}-mobile-750.jpg 750w, ${mobile} 1200w`,
    },
    placeholder: INTRO_PLACEHOLDERS[desktop]
      ? { desktop: INTRO_PLACEHOLDERS[desktop], mobile: INTRO_PLACEHOLDERS[mobile] }
      : undefined,
    ...text,
    motion,
    review,
  };
}

const empresasImage = (name: string, alt: string): SanityImage => ({
  url: `/images/experiencias/empresas/${name}.jpg`,
  alt,
  width: 1600,
  height: 2000,
});

export const DOOR_EXPERIENCE: Partial<Record<DoorId, DoorExperience>> = {
  empresas: {
    ctaLabel: "Solicitar una propuesta",
    // Publicables hoy: sala, salón y terraza (fotos del 30/10 e IMG_5395, sin
    // personas). Las de personas entran solas cuando se autoricen.
    scenes: [
      scene(
        "empresas",
        "sala",
        "Sala de reuniones con mesa de madera, sillas mostaza y pantalla, junto a los ventanales",
        { eyebrow: "01 · Reunirse", title: "Una mesa para pensar juntos, con luz natural.", body: "Reuniones, comités y sesiones de trabajo." },
        "pushIn"
      ),
      scene(
        "empresas",
        "reunion",
        "Reunión de trabajo alrededor de una mesa larga con pantalla, vista desde arriba",
        { eyebrow: "02 · Trabajar", title: "Sesiones de trabajo alrededor de la mesa." },
        "pushIn",
        "consent" // DSC04690 · personas reconocibles
      ),
      scene(
        "empresas",
        "presentar",
        "Presentación ante un grupo en el salón de doble altura con pantalla",
        { eyebrow: "03 · Presentar", title: "Un salón de doble altura para presentar y formar.", body: "Formaciones, charlas y presentaciones." },
        "pushIn",
        "consent" // IMG_5467 · personas reconocibles
      ),
      scene(
        "empresas",
        "salon",
        "Salón de doble altura con mesas preparadas, sillas mostaza y la escalera hacia el altillo",
        { eyebrow: "04 · Compartir mesa", title: "A mediodía, el salón para comer todos juntos.", body: "Comidas y pausas sin salir de la finca." },
        "driftRight"
      ),
      scene(
        "empresas",
        "aire-libre",
        "Grupo sentado al aire libre junto a las pistas, con pinos y vistas al valle",
        { eyebrow: "05 · Encontrarse", title: "Dinámicas al aire libre, frente al paisaje.", body: "Talleres y actividades de equipo en el exterior." },
        "pullOut",
        "consent" // IMG_5474 · personas a media distancia
      ),
      scene(
        "empresas",
        "terraza-vistas",
        "Terraza con mesas de madera y sillas verdes entre pinos, con vistas a la sierra",
        { eyebrow: "06 · Conectar", title: "Y para cerrar la jornada, la terraza entre pinos.", body: "Café, conversación y vistas a la sierra." },
        "pullOut"
      ),
    ],
    formats: [
      {
        title: "Reuniones y presentaciones",
        body: "Comités, reuniones de dirección o presentaciones a clientes y equipos, con mesa de trabajo y pantalla.",
      },
      {
        title: "Formaciones y workshops",
        body: "Sesiones de formación y talleres en interior o en la terraza, con espacio para trabajar en grupo.",
      },
      {
        title: "Jornadas de equipo",
        body: "Un día entero fuera de la oficina: trabajo por la mañana, comida juntos y actividades por la tarde.",
      },
      {
        title: "Jornadas estratégicas",
        body: "Planificación y sesiones de reflexión en un entorno tranquilo, rodeado de pinos y con vistas a la sierra.",
      },
    ],
    spaces: [
      {
        title: "Comedor",
        body: "Mesas para comer juntos o trabajar por grupos.",
        image: empresasImage("comedor-mesas-espacio", "Comedor con mesas en línea, sillas mostaza y ventanales con estores"),
      },
      {
        title: "Terraza",
        body: "Exterior cubierto con toldo, a lo largo de la fachada.",
        image: empresasImage("terraza-espacio", "Terraza cubierta con toldo junto a la fachada blanca y el jardín"),
      },
    ],
    related: [
      { doorId: "estancias", note: "¿Os quedáis a dormir?" },
      { doorId: "eventos", note: "¿Celebráis algo con el equipo?" },
    ],
  },

  eventos: {
    ctaLabel: "Organizar mi evento",
    scenes: [
      scene(
        "eventos",
        "mesa",
        "Mesa larga de banquete con platos, velas y caminos de yute junto a la piscina",
        { eyebrow: "01 · La mesa", title: "Una mesa larga junto al agua.", body: "Bodas, aniversarios y celebraciones con las personas que importan." },
        "pushIn"
      ),
      scene(
        "eventos",
        "piscina",
        "Piscina y jardín entre pinos, con sombrillas y pérgola al fondo",
        { eyebrow: "02 · El jardín", title: "Piscina, pinos y espacio para que la fiesta respire." },
        "driftRight",
        "consent" // IMG_5107 · caras legibles en el grupo bajo la pérgola
      ),
      scene(
        "eventos",
        "aperitivo",
        "Buffet de aperitivos al aire libre sobre una mesa larga con mantel blanco",
        { eyebrow: "03 · El aperitivo", title: "Aperitivos y buffets al aire libre.", body: "Cada celebración, a su manera." },
        "driftLeft"
      ),
      scene(
        "eventos",
        "noche",
        "Celebración al atardecer junto a la piscina, con guirnaldas de luces",
        { eyebrow: "04 · La noche", title: "Cuando cae el sol, se encienden las luces." },
        "pushIn",
        "consent" // IMG_4713 · invitados reconocibles
      ),
      scene(
        "eventos",
        "vistas",
        "Terraza con mesas de madera bajo un gran pino, con vistas al valle",
        { eyebrow: "05 · El lugar", title: "Y siempre, las vistas desde la terraza." },
        "pullOut"
      ),
    ],
  },

  // PROVISIONAL: fotos profesionales de 2024, pendientes de confirmar que las
  // habitaciones siguen igual. No hay foto de 2026 de estas habitaciones con
  // la que sustituirlas (no se cambia una habitación por otra).
  estancias: {
    ctaLabel: "Consultar disponibilidad",
    scenes: [
      scene(
        "estancias",
        "habitacion-luz",
        "Habitación luminosa con cama, zona de estar con sofá azul y mesa de comedor",
        { eyebrow: "01 · Despertar", title: "Habitaciones amplias, llenas de luz.", body: "Para quedarse unos días o unas semanas." },
        "pushIn",
        "validation" // 2024 · pendiente de confirmar
      ),
      scene(
        "estancias",
        "habitacion-doble",
        "Habitación doble con cama grande, suelo de baldosa roja y chimenea",
        { eyebrow: "02 · Descansar", title: "Habitaciones con el carácter de la casa." },
        "driftRight",
        "validation" // 2024 · pendiente de confirmar
      ),
      scene(
        "estancias",
        "habitacion-chimenea",
        "Habitación con chimenea, pared de piedra y ventanales hacia los árboles",
        { eyebrow: "03 · Quedarse", title: "Piedra, madera y una chimenea encendida.", body: "Cuando fuera refresca." },
        "pushIn",
        "validation" // 2024 · pendiente de confirmar
      ),
      scene(
        "estancias",
        "literas",
        "Habitación con literas de madera y cama preparada con toallas",
        { eyebrow: "04 · Juntos", title: "Espacio para venir en familia o con amigos.", body: "Por habitaciones o la casa entera." },
        "pullOut",
        "validation" // 2024 · pendiente de confirmar
      ),
    ],
  },

  comunidad: {
    ctaLabel: "Participar en la comunidad",
    // Hasta autorizar las fotos con personas: portada editorial con la foto 12
    // del vídeo de la Home (aprobada, sin personas). La secuencia completa
    // queda lista y se activa sola al quitar los "consent".
    cover: scene(
      "comunidad",
      "portada",
      "Pistas de pickleball bajo un gran pino, con la casa y su terraza al fondo",
      { title: "Pistas, jardín y una comunidad que crece." },
      "pullOut"
    ),
    scenes: [
      scene(
        "comunidad",
        "pistas",
        "Pistas de pickleball bajo un gran pino, con la casa y su terraza al fondo",
        { eyebrow: "01 · Encontrarse", title: "Un lugar al que volver.", body: "Pistas, jardín y una comunidad que crece." },
        "pullOut",
        "consent" // IMG_5409 · caras legibles en el balcón y en la pista
      ),
      scene(
        "comunidad",
        "juego",
        "Partido de pickleball en las pistas de la finca, rodeadas de pinos",
        { eyebrow: "02 · Jugar", title: "Encuentros de pickleball para jugar y conocerse." },
        "driftRight",
        "consent" // IMG_5408 · jugadores reconocibles
      ),
      scene(
        "comunidad",
        "yoga",
        "Sesión de yoga sobre esterillas junto a la piscina",
        { eyebrow: "03 · Cuidarse", title: "Yoga y bienestar junto a la piscina." },
        "pushIn",
        "consent" // IMG_5412 · participantes a media distancia
      ),
      scene(
        "comunidad",
        "mesa",
        "Mesa preparada para una comida compartida en el comedor, junto a los ventanales",
        { eyebrow: "04 · Compartir", title: "Y después, una mesa para seguir la conversación." },
        "pushIn"
      ),
    ],
  },
};

export function getDoorExperience(id: DoorId): DoorExperience | undefined {
  return DOOR_EXPERIENCE[id];
}

// Textos de la V1 que la V2 sustituye (Sanity todavía los tiene publicados).
const LEGACY_LABELS = new Set(["ORGANIZA TU JORNADA", "SOLICITA INFORMACIÓN", "CONSULTA DISPONIBILIDAD", "FORMA PARTE DE LA COMUNIDAD"]);

/** Valor de Sanity salvo que esté vacío o sea un texto heredado de la V1. */
export function experienceCopy(value: string | null | undefined, fallback: string): string {
  const text = value?.trim();
  return !text || LEGACY_LABELS.has(text) ? fallback : text;
}

const showPendingConsent = process.env.NODE_ENV === "development";

/** Por debajo de este número de escenas no hay recorrido por scroll, sino portada. */
export const MIN_FILM_SCENES = 2;

export type ResolvedIntro = { kind: "film"; scenes: IntroScene[] } | { kind: "cover"; scene: IntroScene };

/**
 * Bloque A de la puerta: door.cinematicIntro (Sanity) si está activado y
 * tiene escenas con foto; si no, las de código, sin las que esperan
 * autorización fuera de `next dev`. Con menos de MIN_FILM_SCENES escenas se
 * usa la portada editorial de la puerta (sin recorrido artificial de una sola
 * foto); sin portada, null (hero estático de siempre).
 */
export function resolveIntro(door: Door): ResolvedIntro | null {
  const intro = door.cinematicIntro;
  const fromSanity = (intro?.enabled ? intro.scenes ?? [] : [])
    .filter((s) => s.media?.image && s.title)
    .map<IntroScene>((s) => ({
      image: s.media!.image!,
      mobileImage: s.media!.mobileImage,
      eyebrow: s.eyebrow,
      title: s.title!,
      body: s.body,
      motion: s.motion ?? "pushIn",
    }));
  const experience = getDoorExperience(door.id);
  const scenes =
    fromSanity.length > 0
      ? fromSanity
      : (experience?.scenes ?? [])
          .filter((s) => showPendingConsent || s.review !== "consent")
          // «01 · Reunirse»: la numeración sigue el orden de las escenas que quedan.
          .map((s, i) => ({ ...s, eyebrow: s.eyebrow?.replace(/^\d{2}(?= · )/, String(i + 1).padStart(2, "0")) }));
  if (scenes.length >= MIN_FILM_SCENES) {
    // El marcador inline solo hace falta en la portada (el resto se carga antes de verse).
    return { kind: "film", scenes: scenes.map((s, i) => (i === 0 ? s : { ...s, placeholder: undefined })) };
  }
  if (experience?.cover) return { kind: "cover", scene: experience.cover };
  return scenes.length > 0 ? { kind: "film", scenes } : null;
}

export const imageMedia = (image: SanityImage): MediaField => ({ type: "image", image });

/**
 * La puerta con los textos y la foto de cierre de la V2: CTA principal y
 * final con la etiqueta V2 si Sanity tiene la heredada, y como foto del CTA
 * final (door.heroMedia) la última escena de la introducción (o la portada),
 * en lugar de la foto antigua de Sanity.
 */
export function experienceDoor(door: Door): Door {
  const experience = getDoorExperience(door.id);
  if (!experience) return door;
  const intro = resolveIntro(door);
  const closing = intro?.kind === "film" ? intro.scenes[intro.scenes.length - 1] : intro?.scene;
  return {
    ...door,
    primaryCtaLabel: experienceCopy(door.primaryCtaLabel, experience.ctaLabel),
    finalCtaLabel: experienceCopy(door.finalCtaLabel, experience.ctaLabel),
    heroMedia: closing ? imageMedia(closing.image) : door.heroMedia,
  };
}
