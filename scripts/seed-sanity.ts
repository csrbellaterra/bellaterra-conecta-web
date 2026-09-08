/**
 * Seed inicial de Sanity — rellena tu dataset real con el mismo
 * contenido que ya usa la web como datos locales de respaldo
 * (lib/sanity/seed-data.ts), que a su vez está tomado del Documento
 * Fundacional de Bellaterra Conecta.
 *
 * Qué hace:
 *  - Sube las fotos reales de /public/images a la librería de medios
 *    de Sanity (reutilizando el archivo si ya existe, para no
 *    duplicar en reejecuciones).
 *  - Crea/actualiza (createOrReplace, con IDs fijos) estos documentos:
 *      siteSettings, homePage, impact,
 *      door-empresas, door-eventos, door-estancias, door-comunidad, door-pickleball,
 *      page-la-finca, page-contacto
 *
 * Es IDEMPOTENTE: puedes ejecutarlo tantas veces como quieras — usa
 * IDs estables y createOrReplace, así que vuelve a dejar el
 * contenido en el estado de partida en vez de crear duplicados. Si
 * ya has editado contenido desde /studio, volver a ejecutar este
 * script SOBRESCRIBE esos cambios en los documentos de arriba — no lo
 * ejecutes por rutina, solo para el arranque inicial o para
 * resetear a los datos de partida a propósito.
 *
 * IMPORTANTE — impacto: este script SIEMPRE deja impactEnabled en
 * false y no escribe ningún kg total, sin importar lo que haya en
 * lib/sanity/seed-data.ts. La cifra de impacto real solo se activa a
 * mano desde /studio cuando exista un dato verificado (ver
 * EDITOR_GUIDE.md).
 *
 * Uso:
 *   1. Crea un token de escritura en sanity.io/manage → tu proyecto →
 *      API → Tokens → "Add API token", permisos "Editor" (no
 *      "Viewer" — necesita poder escribir).
 *   2. Pégalo en .env.local como SANITY_API_WRITE_TOKEN=... (nunca en
 *      este archivo, nunca en git).
 *   3. Ejecuta: pnpm sanity:seed
 */
import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import { createClient, type SanityClient } from "@sanity/client";

import { doors, homePage, siteSettings, staticPages } from "../lib/sanity/seed-data";
import type { MediaField, PlastyContribution, SanityImage, SeoFields, TextBlock } from "../types/content";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const PROJECT_ROOT = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(PROJECT_ROOT, "public");

// ---------------------------------------------------------------
// 1. Validar configuración antes de tocar nada
// ---------------------------------------------------------------
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";
const writeToken = process.env.SANITY_API_WRITE_TOKEN;

function fail(message: string): never {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
  throw new Error(message); // inalcanzable: solo para que TS confirme el tipo `never`
}

if (!projectId) {
  fail(
    "Falta NEXT_PUBLIC_SANITY_PROJECT_ID en .env.local. Configura primero tu proyecto de Sanity (ver README.md, paso 5) antes de hacer el seed."
  );
}
if (!writeToken) {
  fail(
    "Falta SANITY_API_WRITE_TOKEN en .env.local. Crea un token con permisos de escritura (\"Editor\") en sanity.io/manage → tu proyecto → API → Tokens, y pégalo en .env.local. Nunca lo escribas en el código."
  );
}

const client: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: writeToken,
  useCdn: false,
});

console.log(`\nSembrando contenido en el dataset "${dataset}" del proyecto ${projectId}...\n`);

// ---------------------------------------------------------------
// 2. Subida de imágenes, con caché para no duplicar en reejecuciones
// ---------------------------------------------------------------
const uploadedAssetIds = new Map<string, string>();

async function uploadImage(image: SanityImage) {
  const filename = path.basename(image.url);

  if (uploadedAssetIds.has(filename)) {
    return buildImageField(uploadedAssetIds.get(filename)!, image);
  }

  // Reutiliza el asset si ya se subió en una ejecución anterior, en
  // vez de subir el mismo archivo otra vez.
  const existing = await client.fetch<{ _id: string } | null>(
    `*[_type == "sanity.imageAsset" && originalFilename == $filename][0]{_id}`,
    { filename }
  );

  let assetId: string;
  if (existing?._id) {
    assetId = existing._id;
    console.log(`  = ${filename} (ya existía en la librería de medios)`);
  } else {
    const absolutePath = path.join(PUBLIC_DIR, image.url.replace(/^\//, ""));
    if (!fs.existsSync(absolutePath)) {
      fail(`No encuentro el archivo de imagen ${absolutePath} — comprueba que public/images esté completo.`);
    }
    const asset = await client.assets.upload("image", fs.createReadStream(absolutePath), { filename });
    assetId = asset._id;
    console.log(`  ↑ ${filename} subida`);
  }

  uploadedAssetIds.set(filename, assetId);
  return buildImageField(assetId, image);
}

function buildImageField(assetId: string, image: SanityImage) {
  return {
    _type: "imageWithAlt",
    alt: image.alt,
    asset: { _type: "reference", _ref: assetId },
  };
}

async function mapMedia(media: MediaField) {
  if (media.type === "image" && media.image) {
    return { _type: "mediaField", type: "image", image: await uploadImage(media.image) };
  }
  // El contenido de partida solo usa imágenes; si en el futuro se
  // añade un vídeo desde Sanity, este script no necesita tocarse:
  // ese campo se rellenará directamente desde /studio.
  return { _type: "mediaField", type: media.type };
}

function mapSeo(seo: SeoFields) {
  return {
    _type: "seoFields",
    title: seo.title,
    description: seo.description,
  };
}

function mapPlasty(p: PlastyContribution) {
  return {
    _type: "plastyContribution",
    label: p.label,
    amountEur: p.amountEur,
    kg: p.kg,
    note: p.note,
  };
}

function mapTextBlock(block: TextBlock, key: string) {
  return {
    _type: "textSection",
    _key: key,
    eyebrow: block.eyebrow,
    heading: block.heading,
    body: block.body,
  };
}

function mapNavLinks(links: { label: string; url: string }[], prefix: string) {
  return links.map((link, i) => ({
    _type: "navLink",
    _key: `${prefix}-${i}`,
    label: link.label,
    url: link.url,
  }));
}

// ---------------------------------------------------------------
// 3. Construcción de documentos
// ---------------------------------------------------------------
async function buildSiteSettingsDoc() {
  return {
    _id: "siteSettings",
    _type: "siteSettings",
    siteTitle: siteSettings.siteTitle,
    logo: siteSettings.logo ? await uploadImage(siteSettings.logo) : undefined,
    languages: siteSettings.languages.map((lang, i) => ({
      _type: "object",
      _key: `lang-${i}`,
      code: lang.code,
      label: lang.label,
      enabled: lang.enabled,
    })),
    showLanguageSwitcher: siteSettings.showLanguageSwitcher,
    navigation: mapNavLinks(siteSettings.navigation, "nav"),
    address: siteSettings.address,
    email: siteSettings.email,
    phone: siteSettings.phone,
    instagramUrl: siteSettings.instagramUrl || undefined,
    linkedinUrl: siteSettings.linkedinUrl || undefined,
    footerMessage: siteSettings.footerMessage,
    footerLinks: mapNavLinks(siteSettings.footerLinks, "footer"),
    legalLinks: mapNavLinks(siteSettings.legalLinks, "legal"),
  };
}

async function buildHomePageDoc() {
  return {
    _id: "homePage",
    _type: "homePage",
    hero: {
      _type: "heroSection",
      eyebrow: homePage.hero.eyebrow,
      title: homePage.hero.title,
      subtitle: homePage.hero.subtitle,
      location: homePage.hero.location,
      media: await mapMedia(homePage.hero.media),
      ctaLabel: homePage.hero.ctaLabel,
      ctaUrl: homePage.hero.ctaUrl,
    },
    selectorHeading: homePage.selectorHeading,
    selectorSubheading: homePage.selectorSubheading,
    connectionSection: {
      heading: homePage.connectionSection.heading,
      media: await mapMedia(homePage.connectionSection.media),
    },
    impactSection: {
      _type: "impactSection",
      heading: homePage.impactSection.heading,
      body: homePage.impactSection.body,
      ctaLabel: homePage.impactSection.ctaLabel,
      ctaUrl: homePage.impactSection.ctaUrl,
    },
    footerCta: homePage.footerCta
      ? {
          _type: "ctaSection",
          heading: homePage.footerCta.heading,
          ctaLabel: homePage.footerCta.ctaLabel,
          ctaUrl: homePage.footerCta.ctaUrl,
        }
      : undefined,
    seo: mapSeo(homePage.seo),
  };
}

/**
 * La cifra de impacto NUNCA se rellena aquí con un dato real: se
 * fuerza impactEnabled a false pase lo que pase en seed-data.ts, tal
 * y como ha pedido explícitamente Aleix. Actívala solo a mano desde
 * /studio cuando haya una cifra verificada.
 */
function buildImpactDoc() {
  return {
    _id: "impact",
    _type: "impact",
    impactEnabled: false,
  };
}

async function buildDoorDoc(door: (typeof doors)[number]) {
  return {
    _id: `door-${door.slug}`,
    _type: "door",
    name: door.name,
    slug: { _type: "slug", current: door.slug },
    order: door.order,
    icon: door.icon,
    eyebrow: door.eyebrow,
    shortDescription: door.shortDescription,
    selectorImage: await uploadImage(door.selectorImage),
    heroMedia: await mapMedia(door.heroMedia),
    headline: door.headline,
    introduction: door.introduction,
    contentBlocks: door.contentBlocks.map((block, i) =>
      block._type === "textSection" ? mapTextBlock(block, `${door.slug}-block-${i}`) : null
    ).filter(Boolean),
    gallery: await Promise.all(door.gallery.map((img) => uploadImage(img))),
    ctaLabel: door.ctaLabel,
    ctaUrl: door.ctaUrl,
    plastyContribution: door.plastyContribution ? mapPlasty(door.plastyContribution) : undefined,
    seo: mapSeo(door.seo),
  };
}

async function buildPageDoc(slug: string, page: (typeof staticPages)[string]) {
  return {
    _id: `page-${slug}`,
    _type: "page",
    title: page.title,
    slug: { _type: "slug", current: page.slug },
    blocks: page.blocks.map((block, i) =>
      block._type === "textSection" ? mapTextBlock(block, `${slug}-block-${i}`) : null
    ).filter(Boolean),
    seo: mapSeo(page.seo),
  };
}

// ---------------------------------------------------------------
// 4. Ejecutar: subir imágenes, construir documentos, commitear
// ---------------------------------------------------------------
async function run() {
  console.log("Subiendo imágenes y construyendo documentos...\n");

  const siteSettingsDoc = await buildSiteSettingsDoc();
  const homePageDoc = await buildHomePageDoc();
  const impactDoc = buildImpactDoc();

  const doorDocs = [];
  for (const door of doors) {
    console.log(`Puerta: ${door.name}`);
    doorDocs.push(await buildDoorDoc(door));
  }

  const pageDocs = [];
  for (const [slug, page] of Object.entries(staticPages)) {
    console.log(`Página: ${page.title}`);
    pageDocs.push(await buildPageDoc(slug, page));
  }

  const allDocs = [siteSettingsDoc, homePageDoc, impactDoc, ...doorDocs, ...pageDocs];

  console.log(`\nPublicando ${allDocs.length} documentos en Sanity (createOrReplace)...\n`);

  let tx = client.transaction();
  for (const doc of allDocs) {
    tx = tx.createOrReplace(doc as Record<string, unknown> & { _id: string; _type: string });
  }
  await tx.commit();

  console.log("✔ Seed completado:");
  console.log("  - siteSettings");
  console.log("  - homePage");
  console.log("  - impact (impactEnabled: false)");
  for (const door of doors) console.log(`  - door-${door.slug}`);
  for (const slug of Object.keys(staticPages)) console.log(`  - page-${slug}`);
  console.log("\nAbre http://localhost:3000/studio para verlo y editarlo.\n");
}

run().catch((error) => {
  console.error("\n✖ El seed ha fallado:\n");
  console.error(error);
  process.exit(1);
});
