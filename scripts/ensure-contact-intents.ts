/**
 * Corrección puntual y NO destructiva de /contacto: si el documento
 * `contactPage` de Sanity ya existe pero le falta la 7ª intención
 * ("Otra cosa"), la añade; si ya existe pero con `enabled` distinto de
 * `true`, la corrige SOLO en ese campo — nunca toca ni reordena el
 * resto de intenciones.
 *
 * NOTA (segunda corrección): el frontend YA NO depende únicamente de
 * que este script se haya ejecutado — `lib/content.ts → getContactPage`
 * combina las intenciones de Sanity con lib/contactCopy.ts por `id`,
 * así que "Otra cosa" aparece en /contacto aunque este script nunca se
 * haya corrido. Este script sigue siendo útil para que la intención
 * quede también escrita en Sanity y sea editable desde Studio como
 * las otras 6, pero ya no es la única vía para que se vea en la web.
 *
 * Qué hace, en orden:
 *   1. Lee el documento `contactPage` (_id determinista "contactPage",
 *      igual que el resto de singletons — ver seed-sanity.ts → "impact").
 *   2. Si el documento NO existe todavía, lo crea con
 *      `createIfNotExists` usando el hero y las 7 intenciones de
 *      lib/contactCopy.ts como punto de partida.
 *   3. Si el documento SÍ existe:
 *      a. Busca una intención con id "otra-cosa"/"other", o cuya URL de
 *         destino ya sea "/solicitud/general?ctaSource=contacto-general".
 *      b. Si NO existe ninguna, añade una nueva al final del array con
 *         `insert("after", "intents[-1]", […])` — un único elemento
 *         nuevo, nunca reescribe el array completo.
 *      c. Si SÍ existe pero su `enabled` no es exactamente `true`
 *         (undefined, false, o cualquier otro valor), la corrige con un
 *         `set()` dirigido SOLO a ese campo de ESE elemento del array
 *         (por `_key` si lo tiene, si no por `id`) — nunca toca title/
 *         description/url/order ni el resto de intenciones.
 *      d. Si ya existe y ya tiene `enabled: true`, no hace nada.
 *   4. Imprime en todos los casos el id/enabled/order encontrados, para
 *      poder diagnosticar sin tener que abrir Studio.
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

type ExistingIntent = { _key?: string; id?: string; url?: string; order?: number; enabled?: boolean };
type ExistingContactPage = { _id: string; intents?: ExistingIntent[] | null } | null;

async function run() {
  console.log(`\nComprobando la intención "Otra cosa" en contactPage (dataset "${dataset}")...\n`);

  const existing = await client.fetch<ExistingContactPage>(
    `*[_type == "contactPage"][0]{ _id, intents[]{ _key, id, url, order, enabled } }`
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

  // GROQ devuelve `null` (no `[]`) si el array está vacío o no existe — normalizamos antes de iterar.
  const intents = Array.isArray(existing.intents) ? existing.intents : [];
  console.log(`  contactPage (${existing._id}) tiene ${intents.length} intención(es) actualmente:`);
  for (const intent of intents) {
    console.log(`    - id=${intent.id ?? "(sin id)"} order=${intent.order ?? "(sin order)"} enabled=${intent.enabled ?? "(sin definir)"}`);
  }
  console.log("");

  const existingOther = intents.find(
    (intent) => (intent.id && OTHER_INTENT_IDS.includes(intent.id)) || intent.url === OTHER_INTENT_URL
  );

  if (existingOther) {
    if (existingOther.enabled === true) {
      console.log(`  ✔ Ya existe "Otra cosa" (id="${existingOther.id}") con enabled=true — no se toca nada.\n`);
      return;
    }

    console.log(`  ⚠ Ya existe "Otra cosa" (id="${existingOther.id}") pero enabled=${existingOther.enabled ?? "(sin definir)"} — corrigiendo solo ese campo.\n`);
    const selector = existingOther._key ? `intents[_key == "${existingOther._key}"].enabled` : `intents[id == "${existingOther.id}"].enabled`;
    await client.patch(existing._id).set({ [selector]: true }).commit();
    console.log(`  ✔ contactPage (${existing._id}) — enabled corregido a true para "${existingOther.id}". El resto de campos no se han tocado.\n`);
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
    // Array vacío/inexistente: no hay ["intents[-1]"] al que anclar el insert, así que se rellena directamente.
    await client.patch(existing._id).setIfMissing({ intents: [] }).insert("after", "intents[-1]", [newIntent]).commit();
  } else {
    await client.patch(existing._id).insert("after", "intents[-1]", [newIntent]).commit();
  }

  console.log(`  ✔ contactPage (${existing._id}) — añadida la intención "Otra cosa" (order ${newIntent.order}, enabled true).\n`);
  console.log("El resto de intenciones no se han tocado.\n");
}

run().catch((error) => {
  console.error("\n✖ La comprobación/corrección ha fallado:\n");
  console.error(error);
  process.exit(1);
});
