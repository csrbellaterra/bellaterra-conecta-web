/**
 * Backfill NO destructivo del copy editorial V2 de la página de puerta
 * (Fase 3: Empresas, Eventos; Fase 4A: Estancias, Comunidad; Fase 4B:
 * Pickleball).
 *
 * Rellena los campos de texto nuevos de cada `door-*` (heroEyebrow,
 * heroHeadline, heroDescription, primaryCtaLabel, featuresTitle,
 * timelineTitle, spacesTitle, finalCtaHeadline, finalCtaBody,
 * finalCtaLabel) SOLO si todavía están vacíos — usa exclusivamente
 * `patch().setIfMissing()`, nunca `createOrReplace` ni `set()`. Si ya
 * rellenaste alguno de estos campos a mano desde /studio, este script
 * lo deja intacto.
 *
 * Deliberadamente NO toca los campos de array (timelineItems,
 * featureSections, spacesGallery, relatedExperiences): esos necesitan
 * fotografía/vídeo real y se rellenan mejor a mano desde /studio, con
 * cada media subida de verdad. Sin este backfill, todas las páginas ya
 * se ven correctamente gracias a los fallbacks de lib/doorCopy.ts —
 * esto solo "adelanta" el texto a Sanity para poder editarlo desde
 * /studio cuando quieras.
 *
 * Uso:
 *   1. Asegúrate de tener SANITY_API_WRITE_TOKEN en .env.local (ver
 *      scripts/seed-sanity.ts para cómo crear el token).
 *   2. Ejecuta: pnpm sanity:backfill-door-copy
 */
import path from "node:path";
import dotenv from "dotenv";
import { createClient, type SanityClient } from "@sanity/client";

import { DOOR_PAGE_COPY } from "../lib/doorCopy";

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

const DOOR_IDS = ["empresas", "eventos", "estancias", "comunidad", "pickleball"] as const;

async function run() {
  console.log(`\nBackfill de copy editorial V2 (página de puerta) en el dataset "${dataset}" (solo campos vacíos)...\n`);

  for (const doorId of DOOR_IDS) {
    const copy = DOOR_PAGE_COPY[doorId];
    await client
      .patch(`door-${doorId}`)
      .setIfMissing({
        heroEyebrow: copy.hero.eyebrow,
        heroHeadline: copy.hero.headline,
        heroDescription: copy.hero.description,
        primaryCtaLabel: copy.hero.ctaLabel,
        featuresTitle: copy.featureSectionsHeading,
        timelineTitle: copy.timeline.title,
        spacesTitle: copy.spaces.title,
        finalCtaHeadline: copy.finalCta.headline,
        finalCtaBody: copy.finalCta.body,
        finalCtaLabel: copy.finalCta.ctaLabel,
      })
      .commit();
    console.log(`  ✔ door-${doorId} — campos de texto vacíos rellenados`);
  }

  console.log("\nListo. Revisa y ajusta el copy desde /studio → Puerta / experiencia → Empresas / Eventos.\n");
  console.log(
    "Nota: timelineItems, featureSections, spacesGallery y relatedExperiences no se han tocado — rellénalos a mano desde /studio con fotografía/vídeo real.\n"
  );
}

run().catch((error) => {
  console.error("\n✖ El backfill ha fallado:\n");
  console.error(error);
  process.exit(1);
});
