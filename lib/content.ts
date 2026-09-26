import { isSanityConfigured } from "@/lib/sanity/env";
import { getClient } from "@/lib/sanity/client";
import {
  allDoorsQuery,
  contactPageQuery,
  doorBySlugQuery,
  eventBySlugQuery,
  formBySlugQuery,
  galleryItemsQuery,
  homePageQuery,
  impactContributorsQuery,
  impactSettingsQuery,
  pageBySlugQuery,
  siteSettingsQuery,
  storyPageQuery,
  upcomingEventsQuery,
} from "@/lib/sanity/queries";
import {
  contactPage as seedContactPage,
  doors as seedDoors,
  getDoorBySlug as getSeedDoorBySlug,
  homePage as seedHomePage,
  impactSettings as seedImpactSettings,
  siteSettings as seedSiteSettings,
  staticPages as seedStaticPages,
  storyPage as seedStoryPage,
} from "@/lib/sanity/seed-data";
import type {
  ContactPage,
  Door,
  DoorId,
  DoorImpactItem,
  Event,
  FormDoc,
  GalleryCategory,
  GalleryItem,
  HomePage,
  ImpactContributor,
  ImpactSettings,
  Page,
  SiteSettings,
  StoryPage,
} from "@/types/content";

/**
 * Capa de contenido única que usa el resto de la app (páginas,
 * componentes de sección). Nunca importan lib/sanity/seed-data.ts ni
 * lib/sanity/queries.ts directamente: siempre pasan por aquí.
 *
 * Mientras no exista un projectId de Sanity real (isSanityConfigured),
 * todo se sirve desde los datos locales de lib/sanity/seed-data.ts,
 * para que `next build` funcione sin depender de un Sanity ya creado.
 * En cuanto Aleix conecte su proyecto de Sanity y publique contenido,
 * estas mismas funciones empiezan a devolver ese contenido sin tocar
 * ni una línea de los componentes.
 *
 * `preview` activa el cliente con borradores (Visual Editing /
 * Presentation) cuando se llama desde una ruta en modo preview.
 */

async function fetchSanity<T>(query: string, params: Record<string, unknown> = {}, preview = false): Promise<T | null> {
  try {
    const client = getClient(preview);
    return await client.fetch<T>(query, params);
  } catch (error) {
    console.error("[lib/content] Error consultando Sanity, usando datos locales:", error);
    return null;
  }
}

export async function getSiteSettings(preview = false): Promise<SiteSettings> {
  if (!isSanityConfigured) return seedSiteSettings;
  const data = await fetchSanity<SiteSettings>(siteSettingsQuery, {}, preview);
  return data ?? seedSiteSettings;
}

/**
 * Orden conceptual fijo de las 5 puertas en "Cinco puertas, un impacto
 * compartido" — independiente del orden en que Sanity devuelva
 * `doorImpact[]` (que depende del orden de filas en Studio, y puede
 * tener huecos, duplicados o referencias rotas). `mergeDoorImpact`
 * SIEMPRE recorre esta lista, nunca el array crudo de Sanity, así que
 * el número de filas resultante es SIEMPRE 5 — ninguna puerta puede
 * "desaparecer" porque falte, esté duplicada o mal referenciada en
 * Sanity.
 */
const CANONICAL_DOOR_ORDER: DoorId[] = ["eventos", "empresas", "estancias", "comunidad", "pickleball"];

/**
 * Combina el `doorImpact[]` de Sanity con el de seed-data.ts PUERTA A
 * PUERTA, indexando por `door` (el slug/id de la referencia, que es la
 * clave estable) y recorriendo SIEMPRE CANONICAL_DOOR_ORDER, no el
 * array de Sanity ni el de seedItems: así, si el editor solo ha
 * rellenado el texto de referencia de Eventos en Sanity, las otras
 * cuatro puertas siguen mostrando su texto de respaldo, y si falta o
 * está duplicada/rota la fila de una puerta en Sanity, esa puerta cae
 * al fallback en vez de desaparecer de la sección.
 *
 * Items de Sanity cuyo `door` no sea una de las 5 puertas conocidas
 * (referencia rota, sin resolver, o duplicada) se IGNORAN — nunca se
 * añaden como fila extra "fantasma": el número de filas es siempre 5,
 * ni más ni menos. Si hay duplicados para la misma puerta, se usa el
 * último elemento del array (comportamiento determinista).
 *
 * Pickleball es un caso especial de negocio, no de datos ausentes:
 * todavía no existe un modelo de contribución PLASTY para Pickleball
 * (ver CLAUDE.md), así que contributions/kg/percentage se fuerzan
 * SIEMPRE a `undefined` para esa puerta, aunque alguien los rellene
 * por error en Sanity — nunca debe insinuar una cifra cuantitativa.
 * Solo puede mostrar `contributionText` si alguien lo ha configurado
 * explícitamente (Sanity o fallback) Y `enabled` es true — nunca se
 * inventa ese texto aquí.
 */
function mergeDoorImpact(sanityItems: DoorImpactItem[] | undefined, seedItems: DoorImpactItem[]): DoorImpactItem[] {
  const sanityByDoor = new Map<DoorId, DoorImpactItem>();
  for (const item of sanityItems ?? []) {
    if (!item?.door) continue; // referencia de puerta sin resolver — se ignora, nunca genera una fila fantasma
    if (!CANONICAL_DOOR_ORDER.includes(item.door)) continue; // solo las 5 puertas conocidas
    sanityByDoor.set(item.door, item); // duplicados: se queda con el último
  }
  const seedByDoor = new Map(seedItems.map((item) => [item.door, item]));

  return CANONICAL_DOOR_ORDER.map((door) => {
    const seedItem = seedByDoor.get(door);
    const sanityItem = sanityByDoor.get(door);
    const doorName = sanityItem?.doorName || seedItem?.doorName || door;
    const enabled = sanityItem?.enabled ?? seedItem?.enabled ?? false;
    const contributionText = sanityItem?.contributionText || seedItem?.contributionText;

    if (door === "pickleball") {
      // MEDIDA TEMPORAL: Pickleball todavía no tiene modelo de
      // contribución PLASTY definido (ver CLAUDE.md → Content policy).
      // Mientras eso no cambie, contributions/kg/percentage se fuerzan
      // aquí a `undefined` pase lo que pase en Sanity, para que nunca
      // se insinúe una cifra cuantitativa que no existe. En cuanto
      // Bellaterra Conecta defina el nuevo modelo, este caso especial
      // debe eliminarse y Pickleball debe volver a tratarse como
      // cualquier otra puerta (bloque `return` de abajo).
      return { door, doorName, enabled, contributionText, contributions: undefined, kg: undefined, percentage: undefined };
    }

    return {
      door,
      doorName,
      enabled,
      contributionText,
      contributions: sanityItem?.contributions ?? seedItem?.contributions,
      kg: sanityItem?.kg ?? seedItem?.kg,
      percentage: sanityItem?.percentage ?? seedItem?.percentage,
    };
  });
}

/**
 * Prioridad Sanity → fallback CAMPO A CAMPO, no documento-a-documento.
 * Antes, si el documento `impact` de Sanity existía pero todavía no
 * tenía rellenos heroEyebrow/heroHeadline/doorImpact/finalCta*, toda
 * la página quedaba vacía porque `data ?? seedImpactSettings` descarta
 * el fallback en cuanto Sanity devuelve CUALQUIER documento, aunque
 * sus campos individuales estén sin rellenar. Ahora cada campo cae a
 * su equivalente de seed-data.ts si Sanity no lo tiene definido — así
 * el hero, "Cómo funciona PLASTY" y el CTA final se ven siempre,
 * tengas o no ya cargada la tabla de impacto verificada.
 *
 * `impactEnabled` en sí SOLO controla la visibilidad de las cifras
 * acumuladas no verificadas (impactKg, totalContributions, cifras del
 * breakdown por puerta, objetivo anual) — eso lo aplican los
 * componentes (ImpactCounter, ImpactDoorBreakdown), no esta función.
 */
export async function getImpactSettings(preview = false): Promise<ImpactSettings> {
  if (!isSanityConfigured) return seedImpactSettings;
  const data = await fetchSanity<ImpactSettings>(impactSettingsQuery, {}, preview);
  if (!data) return seedImpactSettings;

  return {
    impactEnabled: data.impactEnabled ?? seedImpactSettings.impactEnabled,
    impactKg: data.impactKg ?? seedImpactSettings.impactKg,
    impactUpdatedAt: data.impactUpdatedAt ?? seedImpactSettings.impactUpdatedAt,
    impactMethodology: data.impactMethodology ?? seedImpactSettings.impactMethodology,
    impactMethodologyUrl: data.impactMethodologyUrl ?? seedImpactSettings.impactMethodologyUrl,
    heroEyebrow: data.heroEyebrow || seedImpactSettings.heroEyebrow,
    heroHeadline: data.heroHeadline || seedImpactSettings.heroHeadline,
    heroBody: data.heroBody || seedImpactSettings.heroBody,
    heroMedia: data.heroMedia ?? seedImpactSettings.heroMedia,
    totalContributions: data.totalContributions ?? seedImpactSettings.totalContributions,
    annualTargetEnabled: data.annualTargetEnabled ?? seedImpactSettings.annualTargetEnabled,
    annualTarget: data.annualTarget ?? seedImpactSettings.annualTarget,
    doorImpact: mergeDoorImpact(data.doorImpact, seedImpactSettings.doorImpact ?? []),
    hallOfFameEnabled: data.hallOfFameEnabled ?? seedImpactSettings.hallOfFameEnabled,
    finalCtaHeadline: data.finalCtaHeadline || seedImpactSettings.finalCtaHeadline,
    finalCtaBody: data.finalCtaBody || seedImpactSettings.finalCtaBody,
    finalCtaLabel: data.finalCtaLabel || seedImpactSettings.finalCtaLabel,
    finalCtaUrl: data.finalCtaUrl || seedImpactSettings.finalCtaUrl,
  };
}

export async function getHomePage(preview = false): Promise<HomePage> {
  if (!isSanityConfigured) return seedHomePage;
  const data = await fetchSanity<HomePage>(homePageQuery, {}, preview);
  return data ?? seedHomePage;
}

export async function getAllDoors(preview = false): Promise<Door[]> {
  if (!isSanityConfigured) return seedDoors;
  const data = await fetchSanity<Door[]>(allDoorsQuery, {}, preview);
  return data && data.length > 0 ? data : seedDoors;
}

export async function getDoor(slug: DoorId, preview = false): Promise<Door | undefined> {
  if (!isSanityConfigured) return getSeedDoorBySlug(slug);
  const data = await fetchSanity<Door>(doorBySlugQuery, { slug }, preview);
  return data ?? getSeedDoorBySlug(slug);
}

/** /nuestra-historia (Fase 4B) — documento único, ver types/content.ts → StoryPage. */
export async function getStoryPage(preview = false): Promise<StoryPage> {
  if (!isSanityConfigured) return seedStoryPage;
  const data = await fetchSanity<StoryPage>(storyPageQuery, {}, preview);
  return data ?? seedStoryPage;
}

/**
 * Combina las intenciones del router de /contacto (Sanity ×
 * lib/contactCopy.ts) POR `id`, no documento-a-documento: antes, si
 * Sanity ya tenía 6 de las 7 intenciones cargadas (ej. faltaba "Otra
 * cosa"), `data.intents.length > 0` era true y se usaban SOLO esas 6,
 * descartando por completo la 7ª del fallback. Ahora cada intención
 * conocida del fallback (empresas/eventos/estancias/comunidad/
 * pickleball/visita/otra-cosa) se combina con su equivalente de
 * Sanity si existe (campo a campo, Sanity gana), y si Sanity no tiene
 * ninguna entrada para ese id, se usa el fallback completo para esa
 * fila — así "Otra cosa" (o cualquier otra) nunca puede faltar solo
 * porque el editor no la haya cargado (o dejado a medias) en Sanity
 * todavía. Intenciones que solo existen en Sanity (ids nuevos, no
 * presentes en el fallback) se añaden tal cual al final, sin
 * inventar nada.
 */
function mergeContactIntents(sanityIntents: ContactPage["intents"], fallbackIntents: ContactPage["intents"]): ContactPage["intents"] {
  const fallback = fallbackIntents ?? [];
  const sanityById = new Map<string, NonNullable<ContactPage["intents"]>[number]>();
  for (const intent of sanityIntents ?? []) {
    if (!intent?.id) continue;
    sanityById.set(intent.id, intent); // duplicados: se queda con el último
  }

  const seenIds = new Set<string>();
  const merged = fallback.map((fallbackIntent) => {
    seenIds.add(fallbackIntent.id);
    const sanityIntent = sanityById.get(fallbackIntent.id);
    if (!sanityIntent) return fallbackIntent;
    return {
      id: fallbackIntent.id,
      title: sanityIntent.title || fallbackIntent.title,
      description: sanityIntent.description || fallbackIntent.description,
      url: sanityIntent.url || fallbackIntent.url,
      order: sanityIntent.order ?? fallbackIntent.order,
      enabled: sanityIntent.enabled ?? fallbackIntent.enabled,
      icon: sanityIntent.icon || fallbackIntent.icon,
    };
  });

  const extra = [...sanityById.entries()].filter(([id]) => !seenIds.has(id)).map(([, intent]) => intent);
  return [...merged, ...extra];
}

/**
 * /contacto — documento único, ver types/content.ts → ContactPage.
 * Prioridad Sanity → fallback CAMPO A CAMPO (mismo motivo y mismo
 * patrón que getImpactSettings): si `contactPage` ya existe en Sanity
 * pero todavía no tiene heroEyebrow/heroBody rellenados, por ejemplo,
 * `data ?? seedContactPage` descartaría el fallback entero solo porque
 * el documento existe, dejando esos textos vacíos. Ahora cada campo
 * escalar cae a lib/contactCopy.ts (vía seedContactPage) si Sanity no
 * lo tiene definido. `intents` se combina POR ID (ver
 * mergeContactIntents), no documento-a-documento, por el mismo motivo.
 */
export async function getContactPage(preview = false): Promise<ContactPage> {
  if (!isSanityConfigured) return seedContactPage;
  const data = await fetchSanity<ContactPage>(contactPageQuery, {}, preview);
  if (!data) return seedContactPage;

  return {
    heroEyebrow: data.heroEyebrow || seedContactPage.heroEyebrow,
    heroHeadline: data.heroHeadline || seedContactPage.heroHeadline,
    heroBody: data.heroBody || seedContactPage.heroBody,
    intents: mergeContactIntents(data.intents, seedContactPage.intents),
    locationText: data.locationText || seedContactPage.locationText,
    email: data.email || seedContactPage.email,
    instagramUrl: data.instagramUrl || seedContactPage.instagramUrl,
    mapsUrl: data.mapsUrl || seedContactPage.mapsUrl,
  };
}

export async function getPage(slug: string, preview = false): Promise<Page | undefined> {
  if (!isSanityConfigured) return seedStaticPages[slug];
  const data = await fetchSanity<Page>(pageBySlugQuery, { slug }, preview);
  return data ?? seedStaticPages[slug];
}

export const DOOR_IDS: DoorId[] = ["empresas", "eventos", "estancias", "comunidad", "pickleball"];

/**
 * ---------- V2: Eventos (Family Days), Formularios, Galería ----------
 *
 * Estos tipos de contenido son nuevos en la V2 y no existen en los
 * datos locales de respaldo (lib/sanity/seed-data.ts): sin Sanity
 * configurado, o sin contenido aún publicado, devuelven listas vacías
 * / undefined en vez de inventar contenido de ejemplo.
 */

/** Próximos eventos (fecha >= hoy), ordenados por fecha. `type` filtra por tipo de evento (ej. "familyDay"); si se omite, devuelve todos los tipos. */
export async function getUpcomingEvents(type?: Event["type"], preview = false): Promise<Event[]> {
  if (!isSanityConfigured) return [];
  const data = await fetchSanity<Event[]>(upcomingEventsQuery, { type: type ?? null }, preview);
  return data ?? [];
}

export async function getEvent(slug: string, preview = false): Promise<Event | undefined> {
  if (!isSanityConfigured) return undefined;
  const data = await fetchSanity<Event>(eventBySlugQuery, { slug }, preview);
  return data ?? undefined;
}

/** Formulario activo por slug, para /solicitud/[slug] y cualquier CTA que abra un formulario. */
export async function getForm(slug: string, preview = false): Promise<FormDoc | undefined> {
  if (!isSanityConfigured) return undefined;
  const data = await fetchSanity<FormDoc>(formBySlugQuery, { slug }, preview);
  return data ?? undefined;
}

/** Elementos de /galeria. `category` filtra (ej. "empresas"); si se omite, devuelve todas las categorías. */
export async function getGalleryItems(category?: GalleryCategory, preview = false): Promise<GalleryItem[]> {
  if (!isSanityConfigured) return [];
  const data = await fetchSanity<GalleryItem[]>(galleryItemsQuery, { category: category ?? null }, preview);
  return data ?? [];
}

/**
 * "Comunidad que contribuye" (Hall of Fame, Fase 5) para /impacto. Solo
 * devuelve contributors con publicationConsent = true (filtrado ya en
 * la propia consulta GROQ, ver impactContributorsQuery). Sin Sanity
 * configurado no hay datos de respaldo: se devuelve una lista vacía,
 * igual que el resto de contenido V2 sin seed.
 */
export async function getImpactContributors(preview = false): Promise<ImpactContributor[]> {
  if (!isSanityConfigured) return [];
  const data = await fetchSanity<ImpactContributor[]>(impactContributorsQuery, {}, preview);
  return data ?? [];
}
