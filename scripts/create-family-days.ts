/**
 * Crea los 5 Family Days iniciales (sección 12 del prompt de
 * rediseño): 17 oct, 7 nov, 21 nov, 12 dic y 19 dic de 2026. NO
 * incluye el Family Day inaugural del 26 de septiembre (ya pasado).
 *
 * ADITIVO por diseño: usa `createIfNotExists` con IDs fijos, nunca
 * `createOrReplace` — si ya has editado uno de estos eventos desde
 * /studio, este script no lo toca. No modifica door, homePage,
 * siteSettings, impact ni page.
 *
 * Requiere que scripts/create-forms.ts se haya ejecutado antes (o se
 * ejecute en el mismo momento), porque cada Family Day referencia el
 * formulario "form-family-day" por _id. Si ese formulario no existe
 * todavía, el evento se crea igualmente pero sin `registrationForm`
 * — vuelve a ejecutar este script después de crear el formulario
 * para que la referencia se complete (createIfNotExists no
 * actualiza documentos ya creados, así que si eso ocurre, añade la
 * referencia a mano desde /studio).
 *
 * Uso:
 *   1. Asegúrate de tener SANITY_API_WRITE_TOKEN en .env.local.
 *   2. Ejecuta primero: pnpm sanity:create-forms
 *   3. Después: pnpm sanity:create-family-days
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
if (!writeToken) fail("Falta SANITY_API_WRITE_TOKEN en .env.local (permisos \"Editor\").");

const client: SanityClient = createClient({ projectId, dataset, apiVersion, token: writeToken, useCdn: false });

const SCHEDULE = [
  { time: "09:15 – 10:15", activity: "Pickleball infantil" },
  { time: "10:30 – 12:00", activity: "Americana Pickleball 1 · Yoga 1" },
  { time: "12:00 – 13:30", activity: "Americana Pickleball 2 · Yoga 2" },
  { time: "13:30 – 15:00", activity: "Prueba el pickleball" },
  { time: "15:00 – 16:30", activity: "Campeonato nivel 1" },
  { time: "16:30 – 18:00", activity: "Campeonato nivel 2" },
].map((item, i) => ({ _type: "scheduleItem", _key: `s${i}`, ...item }));

const FAMILY_DAYS = [
  { id: "2026-10-17", date: "2026-10-17", title: "Family Day — 17 de octubre" },
  { id: "2026-11-07", date: "2026-11-07", title: "Family Day — 7 de noviembre" },
  { id: "2026-11-21", date: "2026-11-21", title: "Family Day — 21 de noviembre" },
  { id: "2026-12-12", date: "2026-12-12", title: "Family Day — 12 de diciembre" },
  { id: "2026-12-19", date: "2026-12-19", title: "Family Day — 19 de diciembre" },
];

async function run() {
  console.log(`\nCreando Family Days iniciales en el dataset "${dataset}" (solo si no existen ya)...\n`);

  const registrationFormExists = await client.fetch<boolean>(`defined(*[_id == "form-family-day"][0]._id)`);
  if (!registrationFormExists) {
    console.warn(
      '  ⚠ No encuentro el formulario "form-family-day" todavía. Los eventos se crearán sin registrationForm — ejecuta pnpm sanity:create-forms y añade la referencia a mano desde /studio si hace falta.\n'
    );
  }

  for (const day of FAMILY_DAYS) {
    const doc = {
      _id: `event-family-day-${day.id}`,
      _type: "event",
      title: day.title,
      slug: { _type: "slug", current: `family-day-${day.id}` },
      type: "familyDay",
      date: day.date,
      startTime: "09:15",
      endTime: "18:00",
      status: "upcoming",
      priceText: "10 €",
      schedule: SCHEDULE,
      registrationForm: registrationFormExists ? { _type: "reference", _ref: "form-family-day" } : undefined,
      registrationOpen: true,
      featured: true,
    };

    await client.createIfNotExists(doc as Record<string, unknown> & { _id: string; _type: string });
    console.log(`  ✔ ${doc._id} (${day.date}) — creado si no existía`);
  }

  console.log("\nListo. Revisa y ajusta los Family Days desde /studio → Eventos (Family Days).\n");
  console.log("Recuerda: para actualizar un evento ya creado, edítalo en /studio — este script no lo sobrescribe.\n");
}

run().catch((error) => {
  console.error("\n✖ La creación de Family Days ha fallado:\n");
  console.error(error);
  process.exit(1);
});
