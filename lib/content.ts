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
 * Combina el `doorImpact[]` de Sanity con el de seed-data.ts PUERTA A
 * PUERTA (no documento-a-documento ni array-a-array): si el editor
 * solo ha rellenado el texto de referencia de Eventos en Sanity, las
 * otras cuatro puertas (Empresas, Estancias, Comunidad, Pickleball)
 * siguen mostrando su texto de referencia de respaldo, en vez de
 * desaparecer solo porque el array de Sanity no está completo.
 * Recorre el orden de seedItems (las 5 puertas conocidas) y añade al
 * final cualquier puerta que solo exista en Sanity.
 */
function mergeDoorImpact(sanityItems: DoorImpactItem[] | undefined, seedItems: DoorImpactItem[]): DoorImpactItem[] {
  const sanityByDoor = new Map((sanityItems ?? []).map((item) => [item.door, item]));

  const merged = seedItems.map((seedItem) => {
    const sanityItem = sanityByDoor.get(seedItem.door);
    if (!sanityItem) return seedItem;
    sanityByDoor.delete(seedItem.door);
    return {
      door: seedItem.door,
      doorName: sanityItem.doorName || seedItem.doorName,
      enabled: sanityItem.enabled ?? seedItem.enabled,
      contributionText: sanityItem.contributionText || seedItem.contributionText,
      contributions: sanityItem.contributions ?? seedItem.contributions,
      kg: sanityItem.kg ?? seedItem.kg,
      percentage: sanityItem.percentage ?? seedItem.percentage,
    };
  });

  // Puertas que solo existen en Sanity (no en el fallback conocido) — se añaden tal cual, sin inventar nada.
  return [...merged, ...sanityByDoor.values()];
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
 * /contacto — documento único, ver types/content.ts → ContactPage.
 * Prioridad Sanity → fallback CAMPO A CAMPO (mismo motivo y mismo
 * patrón que getImpactSettings): si `contactPage` ya existe en Sanity
 * pero todavía no tiene heroEyebrow/heroBody rellenados, por ejemplo,
 * `data ?? seedContactPage` descartaría el fallback entero solo porque
 * el documento existe, dejando esos textos vacíos. Ahora cada campo
 * escalar cae a lib/contactCopy.ts (vía seedContactPage) si Sanity no
 * lo tiene definido. `intents` es la única excepción: se resuelve
 * documento-a-documento (si Sanity ya tiene alguna intención cargada,
 * se usan solo esas, sin mezclar con el fallback) para que desactivar
 * u ordenar intenciones desde Sanity sea predecible.
 */
export async function getContactPage(preview = false): Promise<ContactPage> {
  if (!isSanityConfigured) return seedContactPage;
  const data = await fetchSanity<ContactPage>(contactPageQuery, {}, preview);
  if (!data) return seedContactPage;

  return {
    heroEyebrow: data.heroEyebrow || seedContactPage.heroEyebrow,
    heroHeadline: data.heroHeadline || seedContactPage.heroHeadline,
    heroBody: data.heroBody || seedContactPage.heroBody,
    intents: data.intents && data.intents.length > 0 ? data.intents : seedContactPage.intents,
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
