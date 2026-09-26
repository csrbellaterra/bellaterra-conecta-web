/**
 * Backfill NO destructivo del copy editorial V2 de la Home.
 *
 * Rellena los campos nuevos de `homePage` y de cada `door`
 * (selectorIntroduction, connectionHeadline, plastyEyebrow/Headline/
 * Body/CtaLabel/CtaUrl, finalCtaHeadline/Body/Label/Url,
 * homeEyebrow/Headline/Description/CtaLabel) SOLO si todavía están
 * vacíos — usa exclusivamente `patch().setIfMissing()`, nunca
 * `createOrReplace` ni `set()`. Si ya rellenaste alguno de estos
 * campos a mano desde /studio, este script lo deja intacto.
 *
 * No crea documentos, no borra nada, no toca ningún otro campo. Es
 * opcional: la Home ya se ve correctamente sin ejecutar esto gracias
 * a los fallbacks de lib/homeCopy.ts — esto solo "adelanta" ese mismo
 * texto a Sanity para que puedas editarlo desde /studio cuando
 * quieras.
 *
 * Uso:
 *   1. Asegúrate de tener SANITY_API_WRITE_TOKEN en .env.local (ver
 *      scripts/seed-sanity.ts para cómo crear el token).
 *   2. Ejecuta: pnpm sanity:backfill-home-copy
 */
import path from "node:path";
import dotenv from "dotenv";
import { createClient, type SanityClient } from "@sanity/client";

import { HOME_CONNECTION_COPY, HOME_DOOR_COPY, HOME_FINAL_CTA_COPY, HOME_PLASTY_COPY, HOME_SELECTOR_COPY } from "../lib/homeCopy";
import type { DoorId } from "../types/content";

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
if (!writeToken) fail("Falta SANITY_API_WRITE_TOKEN en .env.local (permisos \"Editor\").");

const client: SanityClient = createClient({ projectId, dataset, apiVersion, token: writeToken, useCdn: false });

const DOOR_IDS: DoorId[] = ["empresas", "eventos", "estancias", "comunidad", "pickleball"];

async function run() {
  console.log(`\nBackfill de copy editorial V2 en el dataset "${dataset}" (solo campos vacíos)...\n`);

  await client
    .patch("homePage")
    .setIfMissing({
      selectorIntroduction: HOME_SELECTOR_COPY.introduction,
      connectionHeadline: HOME_CONNECTION_COPY.heading,
      plastyEyebrow: HOME_PLASTY_COPY.eyebrow,
      plastyHeadline: HOME_PLASTY_COPY.heading,
      plastyBody: HOME_PLASTY_COPY.body,
      plastyCtaLabel: HOME_PLASTY_COPY.ctaLabel,
      plastyCtaUrl: HOME_PLASTY_COPY.ctaUrl,
      finalCtaHeadline: HOME_FINAL_CTA_COPY.heading,
      finalCtaBody: HOME_FINAL_CTA_COPY.body,
      finalCtaLabel: HOME_FINAL_CTA_COPY.ctaLabel,
      finalCtaUrl: HOME_FINAL_CTA_COPY.ctaUrl,
    })
    .commit();
  console.log("  ✔ homePage — campos vacíos rellenados (los ya existentes no se han tocado)");

  for (const doorId of DOOR_IDS) {
    const copy = HOME_DOOR_COPY[doorId];
    await client
      .patch(`door-${doorId}`)
      .setIfMissing({
        homeEyebrow: copy.eyebrow,
        homeHeadline: copy.headline,
        homeDescription: copy.body,
        homeCtaLabel: copy.ctaLabel,
      })
      .commit();
    console.log(`  ✔ door-${doorId} — campos vacíos rellenados`);
  }

  console.log("\nListo. Revisa y ajusta el copy desde /studio → Página de inicio / Puertas.\n");
  console.log(
    "Nota: finalCtaForm (el formulario que abre el CTA final) no se ha tocado — selecciónalo a mano desde /studio si quieres que el CTA final abra un formulario en vez de finalCtaUrl.\n"
  );
}

run().catch((error) => {
  console.error("\n✖ El backfill ha fallado:\n");
  console.error(error);
  process.exit(1);
});
