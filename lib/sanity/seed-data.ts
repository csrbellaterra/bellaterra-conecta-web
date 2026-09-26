import type {
  ContactPage,
  Door,
  DoorId,
  DoorImpactItem,
  HomePage,
  ImpactSettings,
  Page,
  SiteSettings,
  StoryPage,
} from "@/types/content";
import { CONTACT_HERO_BODY, CONTACT_HERO_EYEBROW, CONTACT_HERO_HEADLINE, CONTACT_INTENT_OPTIONS } from "@/lib/contactCopy";

/**
 * DATOS LOCALES DE RESPALDO
 * ============================================
 * Se usan mientras no exista un proyecto de Sanity configurado (ver
 * lib/sanity/env.ts → isSanityConfigured) y también como contenido
 * inicial de referencia para rellenar Sanity Studio la primera vez.
 *
 * Fuente de los textos: Documento Fundacional de Bellaterra Conecta
 * (versión de trabajo para socios, septiembre 2026 — posterior a la
 * reunión del 28 de agosto). Las cinco puertas, sus descripciones y
 * las cifras de aportación PLASTY están tomadas literalmente de ese
 * documento. Donde el documento marca algo como pendiente de definir
 * (descuentos de Comunidad, horarios de la escuela de Pickleball,
 * etc.), aquí se refleja igual: pendiente, no un dato inventado.
 *
 * Las fotografías son las reales de la finca ya recopiladas
 * (public/images/**), como marcador temporal hasta que se suban las
 * definitivas desde Sanity.
 * ============================================
 */

const img = (path: string, alt: string, hotspot?: { x: number; y: number }) => ({
  url: path,
  alt,
  hotspot,
});

export const siteSettings: SiteSettings = {
  siteTitle: "Bellaterra Conecta",
  logo: img("/images/general/logo-mark.png", "Bellaterra Conecta"),
  languages: [
    { code: "es", label: "ES", enabled: true },
    { code: "ca", label: "CAT", enabled: false },
    { code: "en", label: "EN", enabled: false },
  ],
  showLanguageSwitcher: true,
  navigation: [
    { label: "Empresas", url: "/empresas" },
    { label: "Eventos", url: "/eventos" },
    { label: "Estancias", url: "/estancias" },
    { label: "Comunidad", url: "/comunidad" },
    { label: "Pickleball", url: "/pickleball" },
    { label: "La finca", url: "/la-finca" },
  ],
  address: "Bellaterra, Cerdanyola del Vallès · Barcelona",
  email: "hola@bellaterraconecta.com",
  phone: "",
  instagramUrl: "https://instagram.com/bellaterraconecta",
  linkedinUrl: "",
  footerMessage: "Nos vemos en Bellaterra.",
  footerLinks: [
    { label: "Contacto", url: "/contacto" },
    { label: "Instagram", url: "https://instagram.com/bellaterraconecta" },
    { label: "Ubicación", url: "/la-finca" },
    { label: "Empresas", url: "/empresas" },
    { label: "Eventos", url: "/eventos" },
    { label: "Estancias", url: "/estancias" },
    { label: "Comunidad", url: "/comunidad" },
    { label: "Pickleball", url: "/pickleball" },
    { label: "Impacto", url: "/impacto" },
    { label: "Galería", url: "/galeria" },
  ],
  legalLinks: [
    { label: "Aviso legal", url: "/legal/aviso-legal" },
    { label: "Privacidad", url: "/legal/privacidad" },
    { label: "Cookies", url: "/legal/cookies" },
  ],
};

/**
 * IMPORTANTE: impactEnabled = false a propósito. El documento
 * fundacional exige cifras verificables, y todavía no existe una
 * "tabla maestra de impacto" consolidada (está listada como pendiente
 * en el propio documento). No mostrar ningún kg total hasta que
 * impactEnabled pase a true con un dato real y su metodología.
 *
 * Los campos nuevos de Fase 5 (hero, doorImpact, finalCta) sí tienen
 * fallback de contenido, porque son copy editorial de referencia, no
 * cifras acumuladas calculadas: `contributionText` reproduce el mismo
 * texto de referencia por puerta que ya vive en doorCopy.ts /
 * plastyContribution (política de contenido en CLAUDE.md — "Content
 * policy — PLASTY / Impacto"). `contributions`, `kg` y `percentage` sí
 * se dejan `undefined`: son datos agregados reales que aún no existen,
 * y los componentes de /impacto deben ocultarlos en vez de mostrar 0.
 * Pickleball no lleva contributionText: sin escuela ni PLASTY de
 * escuela, todavía no hay cifra que mostrar (`enabled: false`).
 */
const doorImpactFallback: DoorImpactItem[] = [
  {
    door: "eventos",
    doorName: "Eventos",
    enabled: true,
    contributionText: "Cada evento reservado está vinculado a la financiación de la recuperación de 70 kg de plástico.",
  },
  {
    door: "empresas",
    doorName: "Empresas",
    enabled: true,
    contributionText: "Cada jornada o experiencia de empresa está vinculada a la financiación de la recuperación de 30 kg de plástico.",
  },
  {
    door: "estancias",
    doorName: "Estancias",
    enabled: true,
    contributionText:
      "Cada noche en habitación individual o Airbnb está vinculada a la financiación de la recuperación de 2 kg de plástico. El alquiler de la casa completa está vinculado a 30 kg por experiencia.",
  },
  {
    door: "comunidad",
    doorName: "Comunidad",
    enabled: true,
    contributionText: "Cada vinculación anual a la Comunidad está vinculada a la financiación de la recuperación de 70 kg de plástico.",
  },
  {
    door: "pickleball",
    doorName: "Pickleball",
    enabled: false,
  },
];

export const impactSettings: ImpactSettings = {
  impactEnabled: false,
  impactKg: undefined,
  impactUpdatedAt: undefined,
  impactMethodology: undefined,
  impactMethodologyUrl: undefined,
  heroEyebrow: "NUESTRO IMPACTO",
  heroHeadline: "Lo que ocurre aquí\ntambién deja huella fuera.",
  heroBody:
    "PLASTY es la herramienta que transforma cada experiencia en Bellaterra Conecta en la financiación de la recuperación de plástico. El modelo se sigue afinando: aquí mostramos cómo funciona, no una cifra cerrada.",
  heroMedia: { mediaType: "image", image: img("/images/general/general-2.jpg", "Vista de la finca de Bellaterra Conecta") },
  totalContributions: undefined,
  annualTargetEnabled: false,
  annualTarget: undefined,
  doorImpact: doorImpactFallback,
  hallOfFameEnabled: false,
  finalCtaHeadline: "Todo empieza con una experiencia.",
  finalCtaBody: "Descubre las diferentes formas de vivir Bellaterra Conecta.",
  finalCtaLabel: "DESCUBRE LAS EXPERIENCIAS",
  finalCtaUrl: "/#selector",
};

const doorMeta: Record<
  DoorId,
  { order: number; icon: Door["icon"] }
> = {
  empresas: { order: 1, icon: "briefcase" },
  eventos: { order: 2, icon: "party" },
  estancias: { order: 3, icon: "bed" },
  comunidad: { order: 4, icon: "community" },
  pickleball: { order: 5, icon: "pickleball" },
};

export const doors: Door[] = [
  {
    id: "empresas",
    slug: "empresas",
    ...doorMeta.empresas,
    name: "Empresas",
    eyebrow: "Reunirse, trabajar y conectar",
    shortDescription: "Reunirse, trabajar y conectar",
    selectorImage: img("/images/empresas/empresas-1.jpg", "Jornada de empresa en la terraza de Bellaterra Conecta"),
    heroMedia: {
      type: "image",
      image: img("/images/empresas/empresas-3.jpg", "Reunión de empresa al aire libre en Bellaterra Conecta"),
    },
    headline: "Salir de la oficina cambia la conversación.",
    introduction:
      "Reuniones, formaciones, presentaciones, workshops y jornadas de equipo en un entorno diferente al espacio de trabajo habitual. Los momentos de trabajo pueden combinarse con restauración, actividades al aire libre o pickleball.",
    contentBlocks: [],
    gallery: [
      img("/images/empresas/empresas-2.jpg", "Espacio interior para reuniones de empresa"),
      img("/images/empresas/empresas-4.jpg", "Terraza chill-out para jornadas de equipo"),
      img("/images/empresas/empresas-5.jpg", "Zona de trabajo al aire libre"),
      img("/images/empresas/empresas-6.jpg", "Porche compartido para jornadas de empresa"),
      img("/images/general/general-2.jpg", "Cocina equipada disponible como extra"),
    ],
    ctaLabel: "Consultar disponibilidad",
    ctaUrl: "/contacto?puerta=empresas",
    plastyContribution: {
      label: "Por jornada o experiencia de empresa",
      amountEur: 25,
      kg: 30,
    },
    seo: {
      title: "Empresas — Bellaterra Conecta",
      description:
        "Reuniones, workshops y jornadas de equipo en una finca de Bellaterra, Barcelona. Sal de la oficina y cambia la conversación.",
    },
  },
  {
    id: "eventos",
    slug: "eventos",
    ...doorMeta.eventos,
    name: "Eventos",
    eyebrow: "Celebrar y compartir",
    shortDescription: "Celebrar y compartir",
    selectorImage: img("/images/eventos/eventos-1.jpg", "Celebración en el jardín de Bellaterra Conecta"),
    heroMedia: {
      type: "image",
      image: img("/images/eventos/eventos-5.jpg", "Evento real celebrado en Bellaterra Conecta"),
    },
    headline: "Un lugar para celebrar.",
    introduction:
      "Celebraciones familiares, cumpleaños, aniversarios, comuniones y otros encuentros en los espacios interiores y exteriores de la finca. La propuesta puede combinar sala, terraza, jardín, piscina, barbacoa, restauración y pickleball, según la época del año y las necesidades del grupo.",
    contentBlocks: [],
    gallery: [
      img("/images/eventos/eventos-2.jpg", "Piscina preparada para una celebración"),
      img("/images/eventos/eventos-3.jpg", "Jardín de la finca durante un evento"),
      img("/images/eventos/eventos-4.jpg", "Zona de barbacoa y porche"),
      img("/images/eventos/eventos-6.jpg", "Evento real en Bellaterra Conecta"),
      img("/images/eventos/eventos-7.jpg", "Celebración al atardecer"),
    ],
    ctaLabel: "Solicitar presupuesto",
    ctaUrl: "/contacto?puerta=eventos",
    plastyContribution: {
      label: "Por evento reservado",
      amountEur: 59,
      kg: 70,
    },
    seo: {
      title: "Eventos — Bellaterra Conecta",
      description:
        "Cumpleaños, aniversarios y celebraciones en un espacio único de Bellaterra, Barcelona. Fotos reales de eventos ya celebrados en la finca.",
    },
  },
  {
    id: "estancias",
    slug: "estancias",
    ...doorMeta.estancias,
    name: "Estancias",
    eyebrow: "Quedarte y disfrutar la finca",
    shortDescription: "Quedarte y disfrutar la finca",
    selectorImage: img("/images/estancias/estancias-1.jpg", "Habitación de Bellaterra Conecta junto a la piscina"),
    heroMedia: {
      type: "image",
      image: img("/images/estancias/estancias-2.jpg", "Habitación con vistas a la finca"),
    },
    headline: "Quédate un poco más.",
    introduction:
      "Bellaterra Conecta ofrece tres formas de alojarse: una habitación privada reservada a través de plataforma, alojamiento anterior o posterior a un evento, y una estancia privada con la casa y la finca en exclusiva para los huéspedes registrados.",
    contentBlocks: [],
    gallery: [
      img("/images/estancias/estancias-3.jpg", "Habitación con terraza"),
      img("/images/estancias/estancias-4.jpg", "Habitación con terraza, vista alternativa"),
      img("/images/estancias/estancias-5.jpg", "Habitación de literas, zona de empresas"),
      img("/images/estancias/estancias-7.jpg", "Habitación cerca del gimnasio y las pistas"),
      img("/images/estancias/estancias-8.jpg", "Zona de paso de la finca"),
    ],
    ctaLabel: "Consultar disponibilidad",
    ctaUrl: "/contacto?puerta=estancias",
    plastyContribution: {
      label: "Por cada noche reservada",
      amountEur: 2,
      kg: 2,
      note: "Independientemente de la modalidad de estancia.",
    },
    seo: {
      title: "Estancias — Bellaterra Conecta",
      description:
        "Alójate en una finca de Bellaterra, Barcelona: habitación privada, alojamiento junto a un evento o la finca en exclusiva.",
    },
  },
  {
    id: "comunidad",
    slug: "comunidad",
    ...doorMeta.comunidad,
    name: "Comunidad",
    eyebrow: "Jornadas abiertas con actividades de deporte, convivencia y participación para descubrir Bellaterra Conecta",
    shortDescription:
      "Jornadas abiertas con actividades de deporte, convivencia y participación para descubrir Bellaterra Conecta",
    selectorImage: img("/images/comunidad/comunidad-1.jpg", "Encuentro de la comunidad en Bellaterra Conecta"),
    heroMedia: {
      type: "image",
      image: img("/images/comunidad/comunidad-3.jpg", "Miembros de la comunidad en un encuentro en la finca"),
    },
    headline: "Hay lugares a los que vuelves.",
    introduction:
      "Comunidad es la puerta de Bellaterra Conecta para las personas que quieren conocer el proyecto, participar en sus actividades y mantener una relación más continuada con la finca. A través de jornadas abiertas, encuentros sociales, deporte y otras iniciativas, construimos una comunidad que comparte experiencias y contribuye a generar un impacto positivo.",
    contentBlocks: [
      {
        _type: "textSection",
        eyebrow: "Family Day",
        heading: "La puerta de entrada a la Comunidad",
        body:
          "Family Day es una de las principales actividades para entrar en la Comunidad: una jornada abierta para descubrir Bellaterra Conecta a través del deporte, la convivencia y la participación, con grupos por niveles, iniciación al pickleball, una clase gratuita, una americana y pequeños campeonatos. Calendario y condiciones se confirmarán antes de cada edición.",
      },
    ],
    gallery: [
      img("/images/comunidad/comunidad-2.jpg", "Actividad de pickleball durante un encuentro de comunidad"),
      img("/images/pickleball/pickleball-1.jpg", "Pistas de pickleball de la finca"),
    ],
    ctaLabel: "Conoce la Comunidad",
    ctaUrl: "/contacto?puerta=comunidad",
    plastyContribution: {
      label: "Vinculación voluntaria anual",
      amountEur: 59,
      kg: 70,
      note: "Válida 12 meses. Ventajas y condiciones especiales se concretarán antes del lanzamiento.",
    },
    seo: {
      title: "Comunidad — Bellaterra Conecta",
      description:
        "Jornadas abiertas, Family Day y encuentros para conocer Bellaterra Conecta, participar y mantener una relación continuada con la finca.",
    },
  },
  {
    id: "pickleball",
    slug: "pickleball",
    ...doorMeta.pickleball,
    name: "Pickleball",
    eyebrow: "Jugar, aprender y competir",
    shortDescription: "Jugar, aprender y competir",
    selectorImage: img("/images/pickleball/pickleball-1.jpg", "Pistas de pickleball de Bellaterra Conecta"),
    heroMedia: {
      type: "image",
      image: img("/images/pickleball/pickleball-3.jpg", "Partido de pickleball en las pistas de la finca"),
    },
    headline: "Juega. Aprende. Conecta.",
    introduction:
      "Tres pistas para reservas particulares, actividades organizadas y una futura escuela de pickleball, que se desarrollará principalmente los sábados. La escuela estará orientada al aprendizaje, la práctica continuada y la creación de comunidad.",
    contentBlocks: [],
    gallery: [
      img("/images/pickleball/pickleball-2.jpg", "Pistas de pickleball rodeadas de naturaleza"),
      img("/images/pickleball/pickleball-4.jpg", "Partida de pickleball"),
      img("/images/pickleball/pickleball-5.jpg", "Pistas de pickleball, vista general"),
      img("/images/pickleball/pickleball-9.jpg", "Gimnasio, disponible como amenity de fin de semana"),
    ],
    ctaLabel: "Reservar pista",
    ctaUrl: "/contacto?puerta=pickleball",
    plastyContribution: {
      label: "Matrícula anual de la escuela",
      amountEur: 59,
      kg: 70,
      note: "Vigencia de 12 meses ligada al curso escolar. Clases y reservas de pista se contratan y pagan aparte — tarifas a consultar.",
    },
    seo: {
      title: "Pickleball — Bellaterra Conecta",
      description:
        "Tres pistas de pickleball en Bellaterra, Barcelona. Reservas, actividades organizadas y escuela de pickleball.",
    },
  },
];

export function getDoorBySlug(slug: string): Door | undefined {
  return doors.find((d) => d.slug === slug);
}

export const homePage: HomePage = {
  hero: {
    _type: "heroSection",
    eyebrow: "Bellaterra Conecta",
    title: "Una finca. Cinco formas de vivirla.",
    location: "Bellaterra · Barcelona",
    media: {
      type: "image",
      image: img("/images/general/aerea-hero.jpg", "Vista aérea de la finca Bellaterra Conecta"),
    },
    ctaLabel: "Descubre la finca",
    ctaUrl: "#selector",
  },
  selectorHeading: "¿Qué te gustaría hacer aquí?",
  selectorSubheading: "Descubre Bellaterra Conecta a tu manera.",
  connectionSection: {
    heading: "Cinco formas de entrar.\nUn mismo lugar al que volver.",
    media: {
      type: "image",
      image: img("/images/general/aerea-hero.jpg", "Vista aérea completa de la finca Bellaterra Conecta"),
    },
  },
  impactSection: {
    _type: "impactSection",
    heading: "Nuestro impacto",
    body: "Descubre cómo cada experiencia contribuye a financiar la recuperación de plástico.",
    ctaLabel: "Conoce nuestro impacto",
    ctaUrl: "/impacto",
  },
  footerCta: {
    _type: "ctaSection",
    heading: "¿Hablamos de tu próxima visita a Bellaterra?",
    ctaLabel: "Escríbenos",
    ctaUrl: "/contacto",
  },
  seo: {
    title: "Bellaterra Conecta — Una finca. Cinco formas de vivirla.",
    description:
      "Finca en Bellaterra, Barcelona, para empresas, eventos, estancias, comunidad y pickleball. Cinco formas de entrar, un mismo lugar al que volver.",
  },
};

/**
 * Fallback de /nuestra-historia (Fase 4B). No hay todavía material
 * fotográfico histórico real subido — se usan fotos genéricas de la
 * finca (public/images/general/*) como marcador temporal, igual que
 * el resto de fallbacks de este archivo.
 */
export const storyPage: StoryPage = {
  heroMedia: { mediaType: "image", image: img("/images/general/aerea-hero.jpg", "Vista aérea de la finca Bellaterra Conecta") },
  heroEyebrow: "NUESTRA HISTORIA",
  heroHeadline: "Una finca familiar.\nUna nueva forma de conectar.",
  heroDetail: "1967 — Bellaterra",
  originTitle: "De dónde venimos",
  originBody:
    "Bellaterra Conecta nace en una finca familiar construida en 1967. Somos la primera generación que ha decidido abrirla a nuevas experiencias y darle un propósito adaptado al presente.",
  originMedia: { mediaType: "image", image: img("/images/general/general-1.jpg", "La finca de Bellaterra Conecta") },
  identityBody:
    "En un mismo lugar conviven deporte, celebraciones, empresa, alojamiento y nuevas conexiones profesionales. Cada experiencia tiene su propia identidad, pero todas forman parte de Bellaterra Conecta.",
  identityItems: [
    { _type: "timelineItem", title: "CELEBRAR", media: { mediaType: "image", image: img("/images/eventos/eventos-1.jpg", "Celebración en Bellaterra Conecta") } },
    { _type: "timelineItem", title: "TRABAJAR", media: { mediaType: "image", image: img("/images/empresas/empresas-1.jpg", "Jornada de empresa en Bellaterra Conecta") } },
    { _type: "timelineItem", title: "QUEDARSE", media: { mediaType: "image", image: img("/images/estancias/estancias-1.jpg", "Alojamiento en Bellaterra Conecta") } },
    { _type: "timelineItem", title: "PARTICIPAR", media: { mediaType: "image", image: img("/images/comunidad/comunidad-1.jpg", "Encuentro de la comunidad en Bellaterra Conecta") } },
    { _type: "timelineItem", title: "JUGAR", media: { mediaType: "image", image: img("/images/pickleball/pickleball-1.jpg", "Pistas de pickleball de Bellaterra Conecta") } },
  ],
  statement: "NO ES LA FINCA.\n\nES TODO LO QUE\nOCURRE DENTRO\nDE ELLA.",
  futureTitle: "Hacia dónde vamos",
  futureBody:
    "Queremos que las personas lleguen por una experiencia, descubran otras posibilidades y encuentren motivos para volver. No buscamos crecer únicamente en actividades, sino construir una comunidad alrededor de experiencias que conectan y generan impacto positivo.",
  futureMedia: { mediaType: "image", image: img("/images/general/general-2.jpg", "Vista de la finca de Bellaterra Conecta") },
  timelineEnabled: false,
  finalCtaHeadline: "¿Quieres conocer Bellaterra Conecta?",
  finalCtaBody: "Ven a descubrir el espacio y cuéntanos qué te gustaría hacer.",
  finalCtaLabel: "VEN A CONOCERNOS",
  finalCtaUrl: "/solicitud/general",
  seo: {
    title: "Nuestra Historia — Bellaterra Conecta",
    description: "Una finca familiar construida en 1967, hoy abierta a nuevas experiencias. De dónde venimos y hacia dónde vamos.",
  },
};

/**
 * Fallback de /contacto (Fase 5, corrección posterior). Reutiliza
 * lib/contactCopy.ts para no duplicar las 7 opciones del router en
 * dos sitios distintos — este objeto es solo lo que se sirve cuando
 * Sanity no está configurado (ver lib/content.ts → getContactPage).
 * email/instagramUrl/locationText se dejan sin definir a propósito:
 * ContactDetails ya sabe usar siteSettings.email/instagramUrl/address
 * como respaldo cuando contactPage no los define.
 */
export const contactPage: ContactPage = {
  heroEyebrow: CONTACT_HERO_EYEBROW,
  heroHeadline: CONTACT_HERO_HEADLINE,
  heroBody: CONTACT_HERO_BODY,
  intents: CONTACT_INTENT_OPTIONS,
};

export const staticPages: Record<string, Page> = {
  "la-finca": {
    slug: "la-finca",
    title: "La finca",
    blocks: [
      {
        _type: "textSection",
        eyebrow: "De dónde venimos",
        heading: "Una finca familiar construida en 1967",
        body:
          "Bellaterra Conecta nace en una finca familiar construida en 1967. Después de décadas de uso privado, la primera generación de la familia ha decidido abrirla a nuevas experiencias y darle un propósito adaptado al presente. Esta transformación parte de algo que ya existe: una casa, jardines, espacios interiores y exteriores, piscina, zona de barbacoa, habitaciones, gimnasio y tres pistas de pickleball.",
      },
      {
        _type: "textSection",
        eyebrow: "Qué queremos construir",
        heading: "No es solo la finca. Es todo lo que ocurre dentro de ella.",
        body:
          "Queremos que las personas puedan llegar a Bellaterra Conecta por una necesidad concreta, descubrir otras posibilidades de la finca y encontrar motivos para volver. Cada actividad tiene su propia propuesta, pero todas comparten una identidad, una manera de relacionarse y un compromiso con la mejora continua.",
      },
    ],
    seo: {
      title: "La finca — Bellaterra Conecta",
      description: "Una finca familiar de Bellaterra construida en 1967, hoy abierta a cinco formas de vivirla.",
    },
  },
  contacto: {
    slug: "contacto",
    title: "Contacto",
    blocks: [
      {
        _type: "textSection",
        heading: "Hablemos",
        body: "Cuéntanos qué puerta te interesa y te contestamos lo antes posible.",
      },
    ],
    seo: {
      title: "Contacto — Bellaterra Conecta",
      description: "Escríbenos para consultar disponibilidad, presupuestos o cualquier duda sobre Bellaterra Conecta.",
    },
  },
};
