/**
 * Corrección puntual y NO destructiva de /contacto (Fase 5, segunda
 * corrección posterior): si el documento `contactPage` de Sanity ya
 * existe pero le falta la 7ª intención ("Otra cosa"), la añade —
 * nunca toca ni reordena las intenciones que ya están.
 *
 * Qué hace, en orden:
 *   1. Lee el documento `contactPage` (_id determinista "contactPage",
 *      igual que el resto de singletons — ver seed-sanity.ts → "impact").
 *   2. Si el documento NO existe todavía, lo crea con
 *      `createIfNotExists` usando el hero y las 7 intenciones de
 *      lib/contactCopy.ts como punto de partida — nunca sobrescribe un
 *      documento ya existente.
 *   3. Si el documento SÍ existe, comprueba si ya hay una intención con
 *      id "otra-cosa"/"other", o cuya URL de destino ya sea
 *      "/solicitud/general?ctaSource=contacto-general" (para no crear
 *      un casi-duplicado con otro id). Si falta, la AÑADE al final del
 *      array con `insert("after", "intents[-1]", […])` — inserta un
 *      único elemento nuevo, nunca reescribe el array completo ni las
 *      intenciones existentes.
 *   4. Si ya existe (con cualquiera de esos criterios), no hace nada.
 *
 * Uso:
 *   1. Asegúrate de tener SANITY_API_WRITE_TOKEN en .env.local.
 *   2. Ejecuta: pnpm sanity:ensure-contact-intents
 */
import path from "node:path";
import dotenv from "dotenv";
import { createClient, type SanityClient } from "@sanity/client";

import { CONTACT_HERO_HEADLINE, CONTACT_INTENT_OPTIONS } from "../lib/contactCopy";

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

const OTHER_INTENT_IDS = ["otra-cosa", "other"];
const OTHER_INTENT_URL = "/solicitud/general?ctaSource=contacto-general";

type ExistingIntent = { _key?: string; id?: string; url?: string; order?: number };
type ExistingContactPage = { _id: string; intents?: ExistingIntent[] } | null;

async function run() {
  console.log(`\nComprobando la intención "Otra cosa" en contactPage (dataset "${dataset}")...\n`);

  const existing = await client.fetch<ExistingContactPage>(
    `*[_type == "contactPage"][0]{ _id, intents[]{ _key, id, url, order } }`
  );

  if (!existing) {
    console.log("  contactPage no existe todavía — creándolo con el hero y las 7 intenciones de lib/contactCopy.ts.\n");
    await client.createIfNotExists({
      _id: "contactPage",
      _type: "contactPage",
      heroHeadline: CONTACT_HERO_HEADLINE,
      intents: CONTACT_INTENT_OPTIONS.map((intent) => ({ _type: "contactIntent", _key: intent.id, ...intent })),
    });
    console.log("  ✔ contactPage creado con las 7 intenciones.\n");
    return;
  }

  const intents = existing.intents ?? [];
  const alreadyHasOther = intents.some(
    (intent) => (intent.id && OTHER_INTENT_IDS.includes(intent.id)) || intent.url === OTHER_INTENT_URL
  );

  if (alreadyHasOther) {
    console.log(`  ✔ contactPage (${existing._id}) ya tiene la intención "Otra cosa" — no se toca nada.\n`);
    return;
  }

  const fallbackOther = CONTACT_INTENT_OPTIONS.find((intent) => intent.id === "otra-cosa");
  if (!fallbackOther) fail('lib/contactCopy.ts ya no tiene un intent con id "otra-cosa" — revisa el fallback antes de reintentar.');

  const maxOrder = intents.reduce((max, intent) => Math.max(max, intent.order ?? 0), 0);
  const newIntent = {
    _type: "contactIntent",
    _key: "otra-cosa",
    id: fallbackOther.id,
    title: fallbackOther.title,
    description: fallbackOther.description,
    url: fallbackOther.url,
    order: maxOrder + 1,
    enabled: true,
  };

  if (intents.length === 0) {
    // Array vacío: no hay ["intents[-1]"] al que anclar el insert, así que se rellena directamente.
    await client.patch(existing._id).setIfMissing({ intents: [] }).insert("after", "intents[-1]", [newIntent]).commit();
  } else {
    await client.patch(existing._id).insert("after", "intents[-1]", [newIntent]).commit();
  }

  console.log(`  ✔ contactPage (${existing._id}) — añadida la intención "Otra cosa" (order ${newIntent.order}).\n`);
  console.log("El resto de intenciones no se han tocado.\n");
}

run().catch((error) => {
  console.error("\n✖ La comprobación/corrección ha fallado:\n");
  console.error(error);
  process.exit(1);
});
