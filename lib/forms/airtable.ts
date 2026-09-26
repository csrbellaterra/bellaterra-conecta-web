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
  eventDate?: string;
  peopleCount?: string;
  selectedOptions?: string;
  message?: string;
  answersJson: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  privacyAccepted: boolean;
  marketingConsent?: boolean;
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

export async function createAirtableSubmission(record: SubmissionRecord): Promise<void> {
  const { pat, baseId, table } = getAirtableConfig();

  // Solo se envían a Airtable los campos con valor: evita pisar
  // defaults de columnas de Airtable (ej. fórmulas, selects con
  // opción por defecto) con valores vacíos.
  const fields: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(record)) {
    if (value !== undefined && value !== "") fields[key] = value;
  }

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
