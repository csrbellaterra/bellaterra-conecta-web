/**
 * Alineación de contenido de la Home V2 (cuatro experiencias) — NO
 * ejecutar hasta publicar la V2: la web de producción lee el mismo
 * dataset y seguiría mostrando cinco puertas con textos de cuatro.
 *
 * Mientras tanto, la rama V2 ya muestra el copy correcto gracias a
 * `v2Copy` (lib/homeCopy.ts), que trata como vacíos los textos del
 * modelo de cinco puertas. Tras ejecutar este script, esos valores
 * quedan en Sanity y `LEGACY_V1_VALUES` puede vaciarse.
 *
 * Solo hace `.set()` de campos de texto concretos de homePage, de las
 * cuatro puertas principales y del enlace /pickleball del pie
 * (siteSettings.footerLinks → "Reservar pista"). No toca media,
 * formularios, el documento de Pickleball ni ningún otro documento.
 *
 * Uso:
 *   pnpm sanity:align-home-v2            → muestra los cambios (sin escribir)
 *   pnpm sanity:align-home-v2 --apply    → los escribe (requiere SANITY_API_WRITE_TOKEN)
 */
import path from "node:path";
import dotenv from "dotenv";
import { createClient } from "@sanity/client";
import { HOME_PORTAL_COPY, HOME_V2_COPY, PRIMARY_DOOR_IDS } from "../lib/homeCopy";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const apply = process.argv.includes("--apply");
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId) throw new Error("Falta NEXT_PUBLIC_SANITY_PROJECT_ID en .env.local.");
if (apply && !token) throw new Error('Falta SANITY_API_WRITE_TOKEN en .env.local (permisos "Editor").');

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

const homeChanges: Record<string, string> = {
  "hero.title": HOME_V2_COPY.heroTitle,
  "hero.ctaLabel": HOME_V2_COPY.heroCtaLabel,
  "hero.ctaUrl": HOME_V2_COPY.heroCtaUrl,
  selectorHeading: HOME_V2_COPY.portalsHeading,
  selectorIntroduction: HOME_V2_COPY.portalsIntroduction,
  connectionHeadline: HOME_V2_COPY.identityHeadline,
  "seo.title": HOME_V2_COPY.seoTitle,
  "seo.description": HOME_V2_COPY.seoDescription,
};

async function run() {
  const homeId = await client.fetch<string | null>(`*[_type == "homePage" && !(_id in path("drafts.**"))][0]._id`);
  if (!homeId) throw new Error("No hay documento homePage publicado.");
  const doors = await client.fetch<{ _id: string; slug: string; eyebrow?: string }[]>(
    `*[_type == "door" && slug.current in $ids && !(_id in path("drafts.**"))]{_id, "slug": slug.current, eyebrow}`,
    { ids: [...PRIMARY_DOOR_IDS] }
  );

  console.log(`\nDataset "${dataset}" — ${apply ? "APLICANDO" : "simulación (sin escribir)"}\n`);
  console.log(`homePage (${homeId}):`);
  for (const [field, value] of Object.entries(homeChanges)) console.log(`  ${field} → ${JSON.stringify(value)}`);
  for (const door of doors) {
    const next = HOME_PORTAL_COPY[door.slug as keyof typeof HOME_PORTAL_COPY].description;
    console.log(`${door._id}: eyebrow ${JSON.stringify(door.eyebrow)} → ${JSON.stringify(next)}`);
  }

  const settings = await client.fetch<{ _id: string; footerLinks?: { _key: string; url: string }[] } | null>(
    `*[_type == "siteSettings" && !(_id in path("drafts.**"))][0]{_id, footerLinks}`
  );
  const pickleballLink = settings?.footerLinks?.find((l) => l.url === "/pickleball");
  if (pickleballLink) console.log(`${settings!._id}: footerLinks /pickleball → "Reservar pista" (/reservar-pista)`);

  if (!apply) {
    console.log("\nNada escrito. Repite con --apply para guardar estos cambios.\n");
    return;
  }

  const tx = client.transaction().patch(homeId, (p) => p.set(homeChanges));
  for (const door of doors) {
    tx.patch(door._id, (p) => p.set({ eyebrow: HOME_PORTAL_COPY[door.slug as keyof typeof HOME_PORTAL_COPY].description }));
  }
  if (settings && pickleballLink) {
    tx.patch(settings._id, (p) =>
      p.set({
        [`footerLinks[_key=="${pickleballLink._key}"].label`]: "Reservar pista",
        [`footerLinks[_key=="${pickleballLink._key}"].url`]: "/reservar-pista",
      })
    );
  }
  await tx.commit();
  console.log("\n✔ Listo.\n");
}

run().catch((error) => {
  console.error("\n✖ La alineación ha fallado:\n", error);
  process.exit(1);
});
