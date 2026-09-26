/**
 * Backfill NO destructivo de /galeria a partir de media que YA existe
 * en Sanity (Fase 5, corrección posterior — validar filtros + masonry
 * + lightbox con fotografías reales, sin duplicar manualmente todo lo
 * que ya se subió a cada puerta).
 *
 * Recorre `door.gallery[]` (imageWithAlt) y `door.spacesGallery[].media`
 * (V2) de las 5 puertas, y opcionalmente algunos campos de media
 * general de `storyPage` (heroMedia/originMedia/futureMedia/
 * statementMedia), y crea un `galleryItem` por cada imagen/vídeo que
 * TODAVÍA NO tenga un `galleryItem` apuntando al mismo asset.
 *
 * TOLERANCIA A CAMPOS VACÍOS (corrección tras fallo con datos reales):
 * GROQ devuelve `null` — no `[]` — cuando un campo array no existe o
 * está vacío en el documento (ej. `spacesGallery[]` sin rellenar).
 * Este script NUNCA itera una colección de Sanity sin normalizarla
 * antes con `toArray()` (ver más abajo), y NUNCA asume que un objeto
 * de media, una imagen o un vídeo existen sin comprobarlo primero.
 * Esto cubre explícitamente: gallery=null/undefined,
 * spacesGallery=null/undefined, items null dentro de esos arrays,
 * media=null, image=null, video=null, storyPage=null (documento
 * entero inexistente) y cualquier campo de media opcional sin
 * rellenar dentro de storyPage.
 *
 * Reglas de seguridad:
 *   - Nunca sube ni genera ningún asset nuevo — solo REFERENCIA los
 *     assets que ya existen en el dataset (mismo `asset._ref`).
 *   - Deduplicación por asset: antes de crear nada, lee todos los
 *     `galleryItem` existentes (creados a mano, por una ejecución
 *     anterior de este script, o por una ejecución que falló a mitad
 *     de camino) y salta cualquier asset que ya esté usado — así se
 *     puede ejecutar tantas veces como haga falta sin generar
 *     duplicados y sin problema si una ejecución anterior se cortó a
 *     mitad (ver nota sobre galleryItem-fromdoor-comunidad-gallery-0/1
 *     más abajo).
 *   - IDs deterministas (`galleryItem-fromdoor-<puerta>-gallery-<n>`,
 *     etc.) + `createIfNotExists`: doble seguridad frente a
 *     duplicados, y CERO riesgo de sobrescribir un documento ya
 *     existente (`createIfNotExists` no toca nada si el _id ya existe).
 *   - No usa `set()`, `patch()` ni `createOrReplace()` en ningún
 *     documento existente — es estrictamente aditivo.
 *   - alt/caption se preservan tal cual estén en el origen; si no hay
 *     alt, el `galleryItem` se crea igualmente sin caption (no se
 *     inventa texto).
 *
 * Categoría: el slug de la puerta (empresas/eventos/estancias/
 * comunidad/pickleball) se usa directamente como `category` (coincide
 * con GalleryCategory). La media general de storyPage se cataloga
 * como "finca" (el valor real del campo `category` en el schema —
 * "La finca" es solo el título mostrado en Studio).
 *
 * Logging: cada fuente (puerta.gallery, puerta.spacesGallery, cada
 * campo de storyPage) que no tenga ningún elemento con media
 * aprovechable imprime una línea "– fuente: sin media, se omite" para
 * poder detectar contenido incompleto sin que el script falle.
 *
 * Uso:
 *   1. Asegúrate de tener SANITY_API_WRITE_TOKEN en .env.local.
 *   2. Ejecuta: pnpm sanity:populate-gallery-from-doors
 *
 * Es seguro volver a ejecutarlo cuantas veces haga falta.
 */
import path from "node:path";
import dotenv from "dotenv";
import { createClient, type SanityClient } from "@sanity/client";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";
const writeToken = process.env.SANITY_API_WRITE_TOKEN;

function fail(message: string): never {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
  throw new Error(message);
}

if (!projectId) fail("Falta NEXT_PUBLIC_SANITY_PROJECT_ID en .env.local.");
if (!writeToken) fail('Falta SANITY_API_WRITE_TOKEN en .env.local (permisos "Editor").');

const client: SanityClient = createClient({ projectId, dataset, apiVersion, token: writeToken, useCdn: false });

/**
 * Único punto del script que convierte "lo que sea que haya devuelto
 * Sanity" en un array seguro de iterar: null, undefined, un objeto
 * suelto o un array con huecos `null` en medio se convierten todos en
 * un array sin nulls. Todo bucle del script pasa por aquí antes de
 * llamar a `.entries()`, `.map()`, `.filter()`, etc.
 */
function toArray<T>(value: T[] | T | null | undefined): NonNullable<T>[] {
  if (Array.isArray(value)) return value.filter((item): item is NonNullable<T> => item != null);
  if (value == null) return [];
  return [value as NonNullable<T>];
}

const DOOR_IDS = ["empresas", "eventos", "estancias", "comunidad", "pickleball"] as const;
type DoorId = (typeof DOOR_IDS)[number];

type Hotspot = { _type?: string; x: number; y: number; height: number; width: number } | null | undefined;

type DoorGalleryImage = { assetId?: string | null; alt?: string | null; hotspot?: Hotspot } | null;

type MediaFieldRaw = {
  mediaType?: "image" | "uploadedVideo" | "externalVideo" | null;
  imageAssetId?: string | null;
  imageAlt?: string | null;
  imageHotspot?: Hotspot;
  videoAssetId?: string | null;
  externalVideoUrl?: string | null;
  caption?: string | null;
} | null;

type DoorSpaceItem = { caption?: string | null; media?: MediaFieldRaw } | null;

type DoorResult = {
  slug?: DoorId | null;
  galleryImages?: DoorGalleryImage[] | null;
  spaces?: DoorSpaceItem[] | null;
} | null;

type StoryResult = {
  heroMedia?: MediaFieldRaw;
  originMedia?: MediaFieldRaw;
  futureMedia?: MediaFieldRaw;
  statementMedia?: MediaFieldRaw;
} | null;

const doorsQuery = `*[_type == "door"]{
  "slug": slug.current,
  "galleryImages": gallery[]{
    "assetId": asset._ref,
    alt,
    hotspot
  },
  "spaces": spacesGallery[]{
    caption,
    media{
      mediaType,
      "imageAssetId": image.asset._ref,
      "imageAlt": image.alt,
      "imageHotspot": image.hotspot,
      "videoAssetId": videoFile.asset._ref,
      externalVideoUrl,
      "posterAssetId": poster.asset._ref,
      "posterAlt": poster.alt,
      autoplay,
      loop
    }
  }
}`;

const storyPageQuery = `*[_type == "storyPage"][0]{
  "heroMedia": heroMedia{ mediaType, "imageAssetId": image.asset._ref, "imageAlt": image.alt, "imageHotspot": image.hotspot, "videoAssetId": videoFile.asset._ref, externalVideoUrl, caption },
  "originMedia": originMedia{ mediaType, "imageAssetId": image.asset._ref, "imageAlt": image.alt, "imageHotspot": image.hotspot, "videoAssetId": videoFile.asset._ref, externalVideoUrl, caption },
  "futureMedia": futureMedia{ mediaType, "imageAssetId": image.asset._ref, "imageAlt": image.alt, "imageHotspot": image.hotspot, "videoAssetId": videoFile.asset._ref, externalVideoUrl, caption },
  "statementMedia": statementMedia{ mediaType, "imageAssetId": image.asset._ref, "imageAlt": image.alt, "imageHotspot": image.hotspot, "videoAssetId": videoFile.asset._ref, externalVideoUrl, caption }
}`;

const existingGalleryAssetsQuery = `*[_type == "galleryItem"]{
  "imageAssetId": media.image.asset._ref,
  "videoAssetId": media.videoFile.asset._ref
}`;

type MediaImage = {
  _type: "media";
  mediaType: "image";
  image: { _type: "image"; asset: { _type: "reference"; _ref: string }; alt?: string; hotspot?: Hotspot };
  caption?: string;
};
type MediaUploadedVideo = {
  _type: "media";
  mediaType: "uploadedVideo";
  videoFile: { _type: "file"; asset: { _type: "reference"; _ref: string } };
  caption?: string;
};
type MediaExternalVideo = { _type: "media"; mediaType: "externalVideo"; externalVideoUrl: string; caption?: string };
type MediaDoc = MediaImage | MediaUploadedVideo | MediaExternalVideo;

/** Construye el objeto "media" (V2) a partir de una imagen suelta de door.gallery (imageWithAlt). Tolera item=null y assetId ausente. */
function mediaFromDoorGalleryImage(item: DoorGalleryImage): MediaImage | null {
  if (!item || !item.assetId) return null;
  return {
    _type: "media",
    mediaType: "image",
    image: {
      _type: "image",
      asset: { _type: "reference", _ref: item.assetId },
      alt: item.alt ?? undefined,
      hotspot: item.hotspot ?? undefined,
    },
  };
}

/** Construye el objeto "media" (V2) a partir de un media V2 ya existente (spacesGallery o storyPage). Tolera media=null/undefined y cualquier subcampo ausente. */
function mediaFromV2(media: MediaFieldRaw | undefined, fallbackCaption?: string | null): MediaDoc | null {
  if (!media) return null;

  if (media.mediaType === "uploadedVideo" && media.videoAssetId) {
    return {
      _type: "media",
      mediaType: "uploadedVideo",
      videoFile: { _type: "file", asset: { _type: "reference", _ref: media.videoAssetId } },
      caption: media.caption || fallbackCaption || undefined,
    };
  }

  if (media.mediaType === "externalVideo" && media.externalVideoUrl) {
    return {
      _type: "media",
      mediaType: "externalVideo",
      externalVideoUrl: media.externalVideoUrl,
      caption: media.caption || fallbackCaption || undefined,
    };
  }

  if (media.imageAssetId) {
    return {
      _type: "media",
      mediaType: "image",
      image: {
        _type: "image",
        asset: { _type: "reference", _ref: media.imageAssetId },
        alt: media.imageAlt ?? undefined,
        hotspot: media.imageHotspot ?? undefined,
      },
      caption: media.caption || fallbackCaption || undefined,
    };
  }

  // mediaType podía venir definido (ej. "uploadedVideo") pero sin el asset todavía subido — se trata igual que "sin media".
  return null;
}

function assetKeyOf(media: MediaDoc | null): string | null {
  if (!media) return null;
  if (media.mediaType === "image") return media.image.asset._ref;
  if (media.mediaType === "uploadedVideo") return media.videoFile.asset._ref;
  return null;
}

async function run() {
  console.log(`\nPoblando /galeria a partir de media ya existente en Sanity (dataset "${dataset}")...\n`);

  const [doorsRaw, storyRaw, existingAssetsRaw] = await Promise.all([
    client.fetch<DoorResult[] | null>(doorsQuery),
    client.fetch<StoryResult>(storyPageQuery),
    client.fetch<{ imageAssetId?: string | null; videoAssetId?: string | null }[] | null>(existingGalleryAssetsQuery),
  ]);

  const doors = toArray(doorsRaw);
  const existingAssets = toArray(existingAssetsRaw);

  const usedAssetIds = new Set<string>();
  for (const item of existingAssets) {
    if (item.imageAssetId) usedAssetIds.add(item.imageAssetId);
    if (item.videoAssetId) usedAssetIds.add(item.videoAssetId);
  }
  const alreadyUsedCount = usedAssetIds.size;

  let created = 0;
  let skippedDuplicate = 0;
  let skippedEmpty = 0;

  async function maybeCreate(id: string, category: string, media: MediaDoc | null, order: number, sourceLabel: string) {
    if (!media) {
      skippedEmpty += 1;
      console.log(`  – ${sourceLabel}: sin media, se omite`);
      return;
    }
    const assetKey = assetKeyOf(media);
    if (media.mediaType !== "externalVideo" && (!assetKey || usedAssetIds.has(assetKey))) {
      skippedDuplicate += 1;
      return;
    }
    if (media.mediaType !== "externalVideo" && assetKey) {
      usedAssetIds.add(assetKey);
    }

    await client.createIfNotExists({
      _id: id,
      _type: "galleryItem",
      media,
      category,
      caption: "caption" in media ? media.caption : undefined,
      featured: false,
      order,
    });
    created += 1;
    console.log(`  ✔ ${id} (${category})`);
  }

  for (const door of doors) {
    const slug = door.slug;
    if (!slug || !DOOR_IDS.includes(slug)) continue;

    const galleryImages = toArray(door.galleryImages);
    const spaces = toArray(door.spaces);

    let order = 0;

    if (galleryImages.length === 0) {
      console.log(`  – ${slug}.gallery: sin media, se omite`);
    }
    for (const [index, image] of galleryImages.entries()) {
      const media = mediaFromDoorGalleryImage(image);
      await maybeCreate(`galleryItem-fromdoor-${slug}-gallery-${index}`, slug, media, order, `${slug}.gallery[${index}]`);
      order += 10;
    }

    if (spaces.length === 0) {
      console.log(`  – ${slug}.spacesGallery: sin media, se omite`);
    }
    for (const [index, space] of spaces.entries()) {
      const media = mediaFromV2(space?.media, space?.caption);
      await maybeCreate(`galleryItem-fromdoor-${slug}-spaces-${index}`, slug, media, order, `${slug}.spacesGallery[${index}]`);
      order += 10;
    }
  }

  if (!storyRaw) {
    console.log("  – storyPage: no existe, se omite\n");
  } else {
    const finca: [string, MediaFieldRaw | undefined][] = [
      ["hero", storyRaw.heroMedia],
      ["origin", storyRaw.originMedia],
      ["future", storyRaw.futureMedia],
      ["statement", storyRaw.statementMedia],
    ];
    let order = 0;
    for (const [key, field] of finca) {
      const media = mediaFromV2(field, null);
      await maybeCreate(`galleryItem-fromstory-${key}`, "finca", media, order, `storyPage.${key}Media`);
      order += 10;
    }
  }

  console.log(`\nListo.`);
  console.log(`  Assets ya usados en galleryItem antes de ejecutar: ${alreadyUsedCount}`);
  console.log(`  galleryItem creados ahora: ${created}`);
  console.log(`  Saltados por ya existir (mismo asset): ${skippedDuplicate}`);
  console.log(`  Saltados por no tener asset (campo vacío en origen): ${skippedEmpty}\n`);
  console.log("Puedes ejecutar este script tantas veces como quieras: no duplica ni sobrescribe nada.\n");
}

run().catch((error) => {
  console.error("\n✖ El backfill de galería ha fallado:\n");
  console.error(error);
  process.exit(1);
});
