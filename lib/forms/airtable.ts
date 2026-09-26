/**
 * Cliente mínimo para escribir en Airtable (tabla Submissions). Solo
 * se usa desde app/api/forms/submit/route.ts (server-side) — nunca
 * desde el navegador. Variables de entorno requeridas, NUNCA
 * NEXT_PUBLIC:
 *
 *   AIRTABLE_PAT
 *   AIRTABLE_BASE_ID
 *   AIRTABLE_SUBMISSIONS_TABLE
 */

export type SubmissionRecord = {
  submissionId: string;
  createdAt: string;
  formSlug: string;
  formTitle?: string;
  pageSource?: string;
  status: "New";
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  /** ---------- Fase 6: origen y seguimiento (aditivo) ---------- */
  ctaSource?: string;
  sourceUrl?: string;
  eventId?: string;
  eventTitle?: string;
  eventDate?: string;
  /**
   * Llega como string desde app/api/forms/submit/route.ts (las
   * respuestas de formulario son siempre string en el navegador, ver
   * FormRenderer — un <input type="number"> expone su valor como
   * string incluso para "20"). También se acepta number por si algún
   * día un caller ya lo manda convertido. `sanitizeAirtableFields` es
   * quien lo convierte a un number real (o lo omite si no es un
   * número válido) antes de llegar a Airtable — nunca se envía como
   * string a una columna Number.
   */
  peopleCount?: string | number;
  selectedOptions?: string;
  message?: string;
  answersJson: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  privacyAccepted: boolean;
  /** Fase 6: renombrado desde marketingConsent para que coincida con el nombre de columna documentado en docs/AIRTABLE_SETUP.md. */
  marketingAccepted?: boolean;
};

export class AirtableConfigError extends Error {}

export function getAirtableConfig() {
  const pat = process.env.AIRTABLE_PAT;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const table = process.env.AIRTABLE_SUBMISSIONS_TABLE;

  if (!pat || !baseId || !table) {
    throw new AirtableConfigError(
      "Faltan variables de entorno de Airtable (AIRTABLE_PAT / AIRTABLE_BASE_ID / AIRTABLE_SUBMISSIONS_TABLE)."
    );
  }

  return { pat, baseId, table };
}

/**
 * Ids de columna de Airtable que son de tipo Number: solo por estas
 * pasa la coerción numérica de abajo. Si en el futuro se añade otra
 * columna numérica al esquema de Airtable (ver
 * docs/AIRTABLE_SETUP.md), basta con añadir su nombre aquí — no hay
 * que tocar el resto de la función de sanitización.
 */
const NUMERIC_FIELDS = new Set(["peopleCount"]);

/** Columnas que son de verdad booleanas en Airtable (checkbox) — siempre se envían como boolean real, nunca como string "true"/"false". */
const BOOLEAN_FIELDS = new Set(["privacyAccepted", "marketingAccepted"]);

/** Columnas de tipo Date en Airtable — si el valor no es una fecha válida, se omite en vez de mandar texto suelto o vacío. */
const DATE_FIELDS = new Set(["eventDate"]);

/**
 * Columnas de tipo Long text en Airtable que deben llegar siempre
 * como un string plano y legible, nunca como objeto/array crudo — por
 * si algún día un caller pasa el valor sin serializar.
 */
const TEXT_SERIALIZED_FIELDS = new Set(["answersJson", "selectedOptions"]);

/**
 * Sanitización CENTRAL del payload antes de enviarlo a Airtable — un
 * único sitio para todas las reglas de tipo, en vez de ir corrigiendo
 * campo a campo cada vez que aparece un 422 nuevo. Reglas:
 *
 *   - Números (NUMERIC_FIELDS): se convierten con `Number(...)`. Si
 *     el resultado no es un número finito (vacío, undefined, null,
 *     "", texto no numérico), el campo se OMITE por completo — nunca
 *     se manda un string a una columna Number de Airtable, que es
 *     justo lo que provocaba el error 422 "INVALID_VALUE_FOR_COLUMN"
 *     en peopleCount.
 *   - Booleanos (BOOLEAN_FIELDS): se fuerzan con `Boolean(...)` y se
 *     envían siempre (incluido `false`), porque son datos con
 *     significado propio, no "vacíos".
 *   - Fechas (DATE_FIELDS): se valida con `Date.parse`; si no es una
 *     fecha reconocible, se omite el campo en vez de mandar texto
 *     suelto o una cadena vacía.
 *   - Long text (TEXT_SERIALIZED_FIELDS): si por lo que sea llega un
 *     objeto/array en vez de un string, se serializa con
 *     `JSON.stringify`; si ya es string, se deja tal cual.
 *   - Cualquier otro campo: se recorta (`trim`) si es string; si tras
 *     eso queda vacío, `null` o `undefined`, se OMITE — nunca se
 *     manda un string vacío a una columna que no lo acepte.
 *
 * No cambia ni un nombre de columna del esquema de Airtable — solo
 * decide, campo a campo, si se envía y con qué tipo de JS.
 */
export function sanitizeAirtableFields(record: SubmissionRecord): Record<string, unknown> {
  const fields: Record<string, unknown> = {};

  for (const [key, rawValue] of Object.entries(record)) {
    if (rawValue === undefined || rawValue === null) continue;

    if (NUMERIC_FIELDS.has(key)) {
      const num = typeof rawValue === "number" ? rawValue : Number(String(rawValue).trim());
      if (Number.isFinite(num)) fields[key] = num;
      // no numérico / vacío → se omite, nunca se manda como string
      continue;
    }

    if (BOOLEAN_FIELDS.has(key)) {
      fields[key] = Boolean(rawValue);
      continue;
    }

    if (DATE_FIELDS.has(key)) {
      const asString = String(rawValue).trim();
      if (asString && !Number.isNaN(Date.parse(asString))) fields[key] = asString;
      continue;
    }

    if (TEXT_SERIALIZED_FIELDS.has(key)) {
      fields[key] = typeof rawValue === "string" ? rawValue : JSON.stringify(rawValue);
      continue;
    }

    if (typeof rawValue === "string") {
      const trimmed = rawValue.trim();
      if (trimmed.length > 0) fields[key] = trimmed;
      // string vacío tras recortar → se omite en vez de mandar ""
      continue;
    }

    // number/boolean ya "genuinos" que no encajan en los sets de
    // arriba (ninguno en el esquema actual, pero por si se añaden):
    // se envían tal cual.
    fields[key] = rawValue;
  }

  return fields;
}

export async function createAirtableSubmission(record: SubmissionRecord): Promise<void> {
  const { pat, baseId, table } = getAirtableConfig();

  const fields = sanitizeAirtableFields(record);

  const res = await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${pat}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ records: [{ fields }] }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Airtable respondió ${res.status}: ${body.slice(0, 500)}`);
  }
}
