import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { AirtableConfigError, createAirtableSubmission } from "@/lib/forms/airtable";
import { checkRateLimit } from "@/lib/forms/rateLimit";

export const runtime = "nodejs";

/**
 * Endpoint server-side único para todos los formularios V2 (ver
 * sanity/schemaTypes/documents/form.ts y el motor de formularios en
 * components/forms). Nunca se escribe a Airtable directamente desde
 * el navegador.
 *
 * Protecciones: honeypot anti-spam, rate limiting básico por IP,
 * validación server-side con Zod, y consentimiento de privacidad
 * obligatorio y separado del consentimiento de marketing (que nunca
 * viene premarcado).
 */

const answerSchema = z.object({
  questionId: z.string().min(1),
  questionLabel: z.string().min(1),
  // La respuesta puede ser texto, número, booleano o una lista
  // (multiSelect/optionCards) — se serializa tal cual a answersJson.
  answer: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]),
});

const submitSchema = z.object({
  formSlug: z.string().min(1),
  formTitle: z.string().optional(),
  pageSource: z.string().optional(),
  answers: z.array(answerSchema).min(1),
  privacyAccepted: z.literal(true, {
    errorMap: () => ({ message: "Debes aceptar la Política de Privacidad." }),
  }),
  marketingConsent: z.boolean().optional().default(false),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  // Campo honeypot: un campo invisible para personas, atractivo para
  // bots. Debe llegar vacío siempre. El nombre es deliberadamente
  // "genérico" para no delatar su propósito a bots simples.
  website: z.string().max(0, "Solicitud rechazada.").optional().default(""),
});

/** Ids de pregunta habituales (ver los FORM_* definidos en scripts/create-forms.ts) usados para rellenar las columnas de conveniencia de Airtable. Todas las respuestas, mapeadas o no, quedan siempre en answersJson. */
const FIELD_ALIASES: Record<string, string[]> = {
  name: ["nombre", "name"],
  email: ["email", "correo"],
  phone: ["telefono", "teléfono", "phone"],
  company: ["empresa", "company"],
  eventDate: ["fecha", "fecha_aproximada", "fecha_entrada", "date"],
  peopleCount: ["num_personas", "numero_personas", "número_personas", "num_participantes", "peoplecount"],
  message: ["mensaje", "message"],
};

function normalizeId(id: string): string {
  return id
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function findAnswerByAliases(
  answers: z.infer<typeof answerSchema>[],
  aliases: string[]
): string | undefined {
  const match = answers.find((a) => aliases.includes(normalizeId(a.questionId)));
  if (!match) return undefined;
  return Array.isArray(match.answer) ? match.answer.join(", ") : String(match.answer);
}

function findSelectedOptions(answers: z.infer<typeof answerSchema>[]): string | undefined {
  const arrays = answers.filter((a) => Array.isArray(a.answer)) as { answer: string[] }[];
  if (arrays.length === 0) return undefined;
  return arrays.flatMap((a) => a.answer).join(", ");
}

export async function POST(request: NextRequest) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido." }, { status: 400 });
  }

  const parsed = submitSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Datos de formulario inválidos.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Honeypot relleno => tratado como spam silenciosamente (no
  // revelamos al bot que fue detectado).
  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { ok: false, error: "Demasiadas solicitudes. Inténtalo de nuevo en unos minutos." },
      { status: 429, headers: rateLimit.retryAfterSeconds ? { "Retry-After": String(rateLimit.retryAfterSeconds) } : undefined }
    );
  }

  const submissionId = crypto.randomUUID();

  try {
    await createAirtableSubmission({
      submissionId,
      createdAt: new Date().toISOString(),
      formSlug: data.formSlug,
      formTitle: data.formTitle,
      pageSource: data.pageSource,
      status: "New",
      name: findAnswerByAliases(data.answers, FIELD_ALIASES.name),
      email: findAnswerByAliases(data.answers, FIELD_ALIASES.email),
      phone: findAnswerByAliases(data.answers, FIELD_ALIASES.phone),
      company: findAnswerByAliases(data.answers, FIELD_ALIASES.company),
      eventDate: findAnswerByAliases(data.answers, FIELD_ALIASES.eventDate),
      peopleCount: findAnswerByAliases(data.answers, FIELD_ALIASES.peopleCount),
      selectedOptions: findSelectedOptions(data.answers),
      message: findAnswerByAliases(data.answers, FIELD_ALIASES.message),
      answersJson: JSON.stringify(data.answers),
      utmSource: data.utmSource,
      utmMedium: data.utmMedium,
      utmCampaign: data.utmCampaign,
      privacyAccepted: data.privacyAccepted,
      marketingConsent: data.marketingConsent,
    });
  } catch (error) {
    if (error instanceof AirtableConfigError) {
      console.error("[api/forms/submit] Airtable no está configurado:", error.message);
      return NextResponse.json(
        { ok: false, error: "El envío de formularios no está disponible todavía. Inténtalo por teléfono o email." },
        { status: 500 }
      );
    }
    console.error("[api/forms/submit] Error escribiendo en Airtable:", error);
    return NextResponse.json({ ok: false, error: "No se ha podido enviar el formulario. Inténtalo de nuevo." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, submissionId });
}
