/**
 * Corrección deliberada de contenido (Fase 4B) — NO es un backfill
 * aditivo como los demás scripts de esta carpeta.
 *
 * El modelo antiguo de "matrícula anual de la escuela" de Pickleball
 * ya no existe (ver CLAUDE.md → Content policy: "eliminar
 * definitivamente escuela, matrícula, programas de aprendizaje y la
 * contribución PLASTY asociada"). Este script fuerza
 * `plastyContributionEnabled = false` en `door-pickleball` con
 * `.set()` en ESE ÚNICO campo — es una sustitución intencional de un
 * valor concreto, no un `setIfMissing` (el campo ya podría tener un
 * valor `true` heredado del seed inicial) ni un `createOrReplace` de
 * documento completo. No toca ningún otro campo de door-pickleball.
 *
 * Nota: la plantilla actual de /pickleball (DoorPageTemplatePickleball)
 * ya no monta el bloque PLASTY en absoluto, así que la página se
 * comporta correctamente exista o no este script — esto solo
 * mantiene el dato de Sanity coherente con la decisión de producto,
 * por si algún día se reutiliza ese campo.
 *
 * Uso:
 *   1. Asegúrate de tener SANITY_API_WRITE_TOKEN en .env.local.
 *   2. Ejecuta: pnpm sanity:disable-pickleball-plasty
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

async function run() {
  console.log(`\nDesactivando plastyContributionEnabled en door-pickleball (dataset "${dataset}")...\n`);

  await client.patch("door-pickleball").set({ plastyContributionEnabled: false }).commit();

  console.log("  ✔ door-pickleball — plastyContributionEnabled = false\n");
  console.log("Listo. El resto de campos de door-pickleball no se han tocado.\n");
}

run().catch((error) => {
  console.error("\n✖ La actualización ha fallado:\n");
  console.error(error);
  process.exit(1);
});
