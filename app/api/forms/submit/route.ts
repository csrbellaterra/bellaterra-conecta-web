import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { AirtableConfigError, createAirtableSubmission } from "@/lib/forms/airtable";
import { checkRateLimit } from "@/lib/forms/rateLimit";
import { getForm } from "@/lib/content";
import type { FormQuestion } from "@/types/content";

export const runtime = "nodejs";

/**
 * Endpoint server-side único para todos los formularios V2 (ver
 * sanity/schemaTypes/documents/form.ts y el motor de formularios en
 * components/forms). Nunca se escribe a Airtable directamente desde
 * el navegador.
 *
 * Protecciones: honeypot anti-spam, rate limiting básico por IP,
 * validación server-side con Zod + validación dinámica contra la
 * definición REAL del formulario en Sanity (no basta con la
 * validación del navegador — "no confiar en datos enviados por
 * navegador"), y consentimiento de privacidad obligatorio y separado
 * del consentimiento de marketing (que nunca viene premarcado).
 */

const answerSchema = z.object({
  questionId: z.string().min(1),
  questionLabel: z.string().min(1),
  // La respuesta puede ser texto, número, booleano o una lista
  // (multiSelect/optionCards) — se serializa tal cual a answersJson.
  answer: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]),
});

/** Metadata de origen/seguimiento (Fase 6), estructurada aparte de `answers` — nunca se muestra al usuario ni depende de un campo de texto libre. */
const trackingSchema = z.object({
  ctaSource: z.string().optional(),
  eventId: z.string().optional(),
  eventTitle: z.string().optional(),
  eventDate: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  sourceUrl: z.string().optional(),
});

const submitSchema = z.object({
  formSlug: z.string().min(1),
  formTitle: z.string().optional(),
  pageSource: z.string().optional(),
  answers: z.array(answerSchema).min(1),
  tracking: trackingSchema.optional().default({}),
  privacyAccepted: z.literal(true, {
    errorMap: () => ({ message: "Debes aceptar la Política de Privacidad." }),
  }),
  marketingAccepted: z.boolean().optional().default(false),
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
  peopleCount: ["num_personas", "numero_personas", "número_personas", "num_participantes", "num_huespedes", "num_jugadores", "peoplecount"],
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

/**
 * Reimplementación server-side, deliberadamente pequeña, de la misma
 * lógica de visibilidad condicional que usa components/forms/
 * FormRenderer.tsx (isVisible). Debe evaluarse igual en los dos
 * sitios: si una pregunta está oculta por lógica condicional, no debe
 * exigirse aquí tampoco, aunque el cliente ya la haya ocultado.
 */
function isQuestionVisible(question: FormQuestion, answersByQuestionId: Map<string, z.infer<typeof answerSchema>["answer"]>): boolean {
  const cond = question.conditionalLogic;
  if (!cond?.dependsOnQuestionId) return true;
  const dependsValue = answersByQuestionId.get(cond.dependsOnQuestionId);
  const compareValue = cond.value ?? "";

  if (cond.condition === "contains") {
    if (Array.isArray(dependsValue)) return dependsValue.includes(compareValue);
    return String(dependsValue ?? "").includes(compareValue);
  }

  const currentAsString = Array.isArray(dependsValue) ? dependsValue.join(",") : String(dependsValue ?? "");
  const matches = currentAsString === compareValue;
  return cond.condition === "notEquals" ? !matches : matches;
}

function isValueEmpty(value: z.infer<typeof answerSchema>["answer"] | undefined): boolean {
  if (value === undefined || value === null) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "boolean") return false;
  return String(value).trim().length === 0;
}

/**
 * Valida las respuestas recibidas contra la definición REAL del
 * formulario cargada desde Sanity — required, email, teléfono básico,
 * número >= 1, fecha válida, opciones permitidas, y respeta las
 * preguntas ocultas por lógica condicional (nunca se exigen). Nunca
 * confía en que el navegador ya haya validado esto.
 */
function validateAnswersAgainstForm(
  questions: FormQuestion[],
  answers: z.infer<typeof answerSchema>[]
): string[] {
  const errors: string[] = [];
  const byId = new Map(answers.map((a) => [a.questionId, a.answer]));

  for (const question of questions) {
    if (!isQuestionVisible(question, byId)) continue;
    const value = byId.get(question.id);
    const empty = isValueEmpty(value);

    if (question.required && empty) {
      errors.push(`"${question.label}" es obligatorio.`);
      continue;
    }
    if (empty) continue;

    if (question.type === "email" && typeof value === "string" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors.push(`"${question.label}" no es un email válido.`);
    }

    if (question.type === "phone" && typeof value === "string" && !/^[+\d][\d\s()-]{5,19}$/.test(value.trim())) {
      errors.push(`"${question.label}" no es un teléfono válido.`);
    }

    if ((question.type === "number" || question.type === "peopleCount") && (typeof value === "string" || typeof value === "number")) {
      const num = Number(value);
      if (!Number.isFinite(num) || num < 1) {
        errors.push(`"${question.label}" debe ser un número igual o mayor que 1.`);
      }
    }

    if (question.type === "date" && typeof value === "string" && Number.isNaN(new Date(value).getTime())) {
      errors.push(`"${question.label}" no es una fecha válida.`);
    }

    if (question.type === "yesNo" && typeof value === "string" && !["yes", "no"].includes(value)) {
      errors.push(`"${question.label}" no es una opción válida.`);
    }

    const optionBased = ["select", "singleChoice", "multiSelect", "checkbox", "optionCards"];
    if (optionBased.includes(question.type) && question.options && question.options.length > 0) {
      const allowed = new Set(question.options.map((o) => o.value));
      const submitted = Array.isArray(value) ? value : [String(value)];
      if (submitted.some((v) => !allowed.has(v))) {
        errors.push(`"${question.label}" contiene una opción no permitida.`);
      }
    }
  }

  return errors;
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

  // Carga el formulario REAL desde Sanity y valida dinámicamente contra
  // su definición actual — nunca contra lo que el cliente cree que es
  // el formulario. Si el formulario no existe o está inactivo, se
  // rechaza el envío (evita que alguien reproduzca una petición a un
  // slug borrado/desactivado).
  const form = await getForm(data.formSlug);
  if (!form || form.active === false) {
    return NextResponse.json({ ok: false, error: "Este formulario ya no está disponible." }, { status: 404 });
  }

  const validationErrors = validateAnswersAgainstForm(form.questions, data.answers);
  if (validationErrors.length > 0) {
    console.error("[api/forms/submit] Validación server-side falló:", validationErrors);
    return NextResponse.json({ ok: false, error: "Revisa los datos del formulario.", issues: validationErrors }, { status: 400 });
  }

  // Family Day: una solicitud nunca debe crearse sin evento
  // identificado de forma estructurada (eventId/eventTitle/eventDate
  // en `tracking`) — nunca basta con que el navegador ya lo validara.
  // El cliente ya deshabilita el envío en este caso (ver
  // FormRenderer), pero el servidor es quien lo hace cumplir de
  // verdad.
  if (data.formSlug === "family-day" && (!data.tracking.eventId || !data.tracking.eventTitle || !data.tracking.eventDate)) {
    return NextResponse.json(
      { ok: false, error: "Elige a qué Family Day te apuntas antes de enviar la solicitud." },
      { status: 400 }
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
      ctaSource: data.tracking.ctaSource,
      sourceUrl: data.tracking.sourceUrl,
      eventId: data.tracking.eventId,
      eventTitle: data.tracking.eventTitle,
      eventDate: data.tracking.eventDate || findAnswerByAliases(data.answers, FIELD_ALIASES.eventDate),
      peopleCount: findAnswerByAliases(data.answers, FIELD_ALIASES.peopleCount),
      selectedOptions: findSelectedOptions(data.answers),
      message: findAnswerByAliases(data.answers, FIELD_ALIASES.message),
      answersJson: JSON.stringify(data.answers),
      utmSource: data.tracking.utmSource,
      utmMedium: data.tracking.utmMedium,
      utmCampaign: data.tracking.utmCampaign,
      privacyAccepted: data.privacyAccepted,
      marketingAccepted: data.marketingAccepted,
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
