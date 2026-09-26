/**
 * Verifica que Airtable está configurado y accesible, SIN escribir
 * ninguna submission. Comprueba, en orden:
 *   1. que las tres variables de entorno existen
 *      (AIRTABLE_PAT / AIRTABLE_BASE_ID / AIRTABLE_SUBMISSIONS_TABLE);
 *   2. que el PAT puede leer la base (metadata de bases);
 *   3. que la tabla configurada existe dentro de esa base.
 *
 * No crea, modifica ni borra ningún registro — solo hace peticiones
 * de lectura a la API de metadata de Airtable.
 *
 * Uso:
 *   1. Rellena AIRTABLE_PAT / AIRTABLE_BASE_ID /
 *      AIRTABLE_SUBMISSIONS_TABLE en .env.local (ver
 *      docs/AIRTABLE_SETUP.md).
 *   2. Ejecuta: pnpm airtable:check
 */
import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

function fail(message: string): never {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
  throw new Error(message);
}

async function run() {
  console.log("\nComprobando configuración de Airtable...\n");

  const pat = process.env.AIRTABLE_PAT;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const table = process.env.AIRTABLE_SUBMISSIONS_TABLE;

  if (!pat) fail("Falta AIRTABLE_PAT en .env.local.");
  if (!baseId) fail("Falta AIRTABLE_BASE_ID en .env.local.");
  if (!table) fail("Falta AIRTABLE_SUBMISSIONS_TABLE en .env.local.");

  console.log(`  ✔ Variables de entorno presentes (tabla configurada: "${table}").\n`);

  console.log("  Comprobando acceso a la base y buscando la tabla (solo lectura, sin escribir nada)...");

  const res = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
    headers: { Authorization: `Bearer ${pat}` },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    fail(`Airtable respondió ${res.status} al consultar la base. Revisa el PAT y el AIRTABLE_BASE_ID.\n\n${body.slice(0, 500)}`);
  }

  const data = (await res.json()) as { tables?: { id: string; name: string }[] };
  const tables = data.tables ?? [];
  const found = tables.find((t) => t.name === table);

  if (!found) {
    const names = tables.map((t) => t.name).join(", ") || "(ninguna)";
    fail(`No se ha encontrado una tabla llamada "${table}" en esta base. Tablas disponibles: ${names}.`);
  }

  console.log(`  ✔ La tabla "${table}" existe en la base y el PAT tiene acceso a ella.\n`);
  console.log("Todo correcto. No se ha creado ni modificado ninguna submission.\n");
}

run().catch((error) => {
  console.error("\n✖ La comprobación ha fallado:\n");
  console.error(error);
  process.exit(1);
});
