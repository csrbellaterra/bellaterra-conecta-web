"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";

import { cn } from "@/lib/utils";
import type { FormDoc, FormQuestion } from "@/types/content";

/**
 * Motor de formularios V2: interpreta un documento `form` de Sanity
 * (título, preguntas con tipo/opciones/lógica condicional/paso) y
 * renderiza un formulario funcional, accesible y en varios pasos
 * cuando las preguntas definen `step`.
 *
 * Esta es la base de Fase 1 (arquitectura): cubre todos los tipos de
 * pregunta y el envío real a /api/forms/submit. El pulido visual
 * final (animaciones de paso, layout de tarjetas optionCards, etc.)
 * se refina en fases posteriores sin cambiar esta lógica.
 *
 * Accesibilidad: cada error se anuncia con aria-invalid +
 * aria-describedby (no solo color), el foco se gestiona de forma
 * nativa vía orden del DOM, y los checkboxes de consentimiento nunca
 * vienen premarcados.
 */

type AnswerValue = string | string[] | boolean | undefined;
type Answers = Record<string, AnswerValue>;

function isVisible(question: FormQuestion, answers: Answers): boolean {
  const cond = question.conditionalLogic;
  if (!cond?.dependsOnQuestionId) return true;
  const dependsValue = answers[cond.dependsOnQuestionId];
  const compareValue = cond.value ?? "";
  const currentAsString = Array.isArray(dependsValue) ? dependsValue.join(",") : String(dependsValue ?? "");
  const matches = currentAsString === compareValue;
  return cond.condition === "notEquals" ? !matches : matches;
}

function isAnswerEmpty(value: AnswerValue): boolean {
  if (value === undefined || value === null) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "boolean") return false;
  return value.trim().length === 0;
}

function getSteps(questions: FormQuestion[]): FormQuestion[][] {
  const hasSteps = questions.some((q) => typeof q.step === "number");
  if (!hasSteps) return [questions];

  const byStep = new Map<number, FormQuestion[]>();
  for (const q of questions) {
    const step = q.step ?? 0;
    if (!byStep.has(step)) byStep.set(step, []);
    byStep.get(step)!.push(q);
  }
  return [...byStep.entries()].sort(([a], [b]) => a - b).map(([, qs]) => qs);
}

export default function FormRenderer({ form, pageSource }: { form: FormDoc; pageSource?: string }) {
  const steps = useMemo(() => getSteps(form.questions), [form.questions]);
  const isMultiStep = steps.length > 1;

  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Preselección desde la URL (ej. un CTA de "Próximos Family Days" que
  // enlaza a /solicitud/family-day?fecha_family_day=17%20de%20octubre...):
  // rellena cualquier pregunta cuyo id coincida con un parámetro de la
  // URL. Genérico para cualquier formulario, no solo Family Day. Se
  // aplica en un efecto (no en el useState inicial) para no desajustar
  // el HTML ya renderizado en servidor.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const prefilled: Answers = {};
    for (const question of form.questions) {
      const value = params.get(question.id);
      if (value) prefilled[question.id] = value;
    }
    if (Object.keys(prefilled).length > 0) {
      setAnswers((prev) => ({ ...prefilled, ...prev }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.questions]);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const currentQuestions = steps[stepIndex].filter((q) => isVisible(q, answers));

  function setAnswer(id: string, value: AnswerValue) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function validateQuestions(questions: FormQuestion[]): boolean {
    const nextErrors: Record<string, string> = {};
    for (const q of questions) {
      if (!isVisible(q, answers)) continue;
      const value = answers[q.id];
      if (q.required && isAnswerEmpty(value)) {
        nextErrors[q.id] = "Este campo es obligatorio.";
        continue;
      }
      if (q.type === "email" && typeof value === "string" && value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        nextErrors[q.id] = "Introduce un email válido.";
      }
    }
    setErrors((prev) => ({ ...prev, ...nextErrors }));
    return Object.keys(nextErrors).length === 0;
  }

  function handleNext() {
    if (!validateQuestions(currentQuestions)) return;
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }

  function handleBack() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const allVisibleQuestions = form.questions.filter((q) => isVisible(q, answers));
    if (!validateQuestions(isMultiStep ? currentQuestions : allVisibleQuestions)) return;

    if (!privacyAccepted) {
      setSubmitError("Debes aceptar la Política de Privacidad para continuar.");
      return;
    }

    setStatus("submitting");
    setSubmitError(null);

    const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;

    // Metadata de seguimiento opcional (ej. un CTA de "Próximos Family
    // Days" que enlaza con ?eventId=...&eventTitle=...&eventDate=..., o
    // el CTA de Nuestra Historia con ?ctaSource=historia-visita): viaja
    // como entradas adicionales de answersJson, sin necesidad de crear
    // preguntas nuevas en el schema del formulario — ver
    // components/sections/door/DoorUpcomingFamilyDays.tsx y
    // components/sections/historia/StoryFinalCta.tsx.
    const EVENT_METADATA_PARAMS: { param: string; label: string }[] = [
      { param: "eventId", label: "ID del evento (origen)" },
      { param: "eventTitle", label: "Evento (origen)" },
      { param: "eventDate", label: "Fecha del evento (origen)" },
      { param: "ctaSource", label: "Origen del CTA" },
    ];
    const eventMetadataAnswers = EVENT_METADATA_PARAMS.map(({ param, label }) => {
      const value = params?.get(param);
      return value ? { questionId: param, questionLabel: label, answer: value } : null;
    }).filter((entry): entry is { questionId: string; questionLabel: string; answer: string } => entry !== null);

    try {
      const res = await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formSlug: form.slug,
          formTitle: form.title,
          pageSource: pageSource ?? (typeof window !== "undefined" ? window.location.pathname : undefined),
          answers: [
            ...allVisibleQuestions.map((q) => ({
              questionId: q.id,
              questionLabel: q.label,
              answer: answers[q.id] ?? "",
            })),
            ...eventMetadataAnswers,
          ],
          privacyAccepted,
          marketingConsent,
          utmSource: params?.get("utm_source") ?? undefined,
          utmMedium: params?.get("utm_medium") ?? undefined,
          utmCampaign: params?.get("utm_campaign") ?? undefined,
          website: honeypot,
        }),
      });

      const body = await res.json().catch(() => ({ ok: false }));
      if (!res.ok || !body.ok) {
        throw new Error(body.error || "No se ha podido enviar el formulario.");
      }

      setStatus("success");
    } catch (error) {
      setStatus("error");
      setSubmitError(error instanceof Error ? error.message : "No se ha podido enviar el formulario.");
    }
  }

  if (status === "success") {
    return (
      <div className="py-10 text-center">
        <h3 className="font-serif text-2xl text-ink">{form.successTitle || "¡Gracias!"}</h3>
        {form.successText && <p className="mt-3 text-muted">{form.successText}</p>}
      </div>
    );
  }

  const isLastStep = stepIndex === steps.length - 1;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {/* Honeypot: invisible para personas, visible para bots simples. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="website">No rellenar este campo</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {isMultiStep && (
        <p className="text-sm text-muted">
          Paso {stepIndex + 1} de {steps.length}
        </p>
      )}

      <div className="space-y-6">
        {currentQuestions.map((question) => (
          <QuestionField key={question.id} question={question} value={answers[question.id]} error={errors[question.id]} onChange={(v) => setAnswer(question.id, v)} />
        ))}
      </div>

      {isLastStep && (
        <div className="space-y-3 border-t border-border pt-6">
          <label className="flex items-start gap-3 text-sm text-text">
            <input
              type="checkbox"
              checked={privacyAccepted}
              onChange={(e) => setPrivacyAccepted(e.target.checked)}
              aria-invalid={!privacyAccepted && submitError ? true : undefined}
              className="mt-0.5 h-4 w-4 shrink-0"
            />
            <span>
              He leído y acepto la{" "}
              <a href="/privacidad" className="underline underline-offset-2">
                Política de Privacidad
              </a>
              .
            </span>
          </label>
          <label className="flex items-start gap-3 text-sm text-muted">
            <input
              type="checkbox"
              checked={marketingConsent}
              onChange={(e) => setMarketingConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0"
            />
            <span>Quiero recibir comunicaciones comerciales de Bellaterra Conecta (opcional).</span>
          </label>
        </div>
      )}

      {submitError && (
        <p role="alert" className="text-sm text-red-700">
          {submitError}
        </p>
      )}

      <div className="flex items-center justify-between gap-4">
        {isMultiStep && stepIndex > 0 ? (
          <button type="button" onClick={handleBack} className="text-sm text-muted underline underline-offset-2">
            Anterior
          </button>
        ) : (
          <span />
        )}

        {isMultiStep && !isLastStep ? (
          <button
            type="button"
            onClick={handleNext}
            className="rounded-pill bg-ink px-6 py-3 text-sm font-medium text-background transition hover:opacity-90"
          >
            Siguiente
          </button>
        ) : (
          <button
            type="submit"
            disabled={status === "submitting"}
            className="rounded-pill bg-ink px-6 py-3 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-50"
          >
            {status === "submitting" ? "Enviando…" : form.submitLabel || "Enviar"}
          </button>
        )}
      </div>
    </form>
  );
}

function QuestionField({
  question,
  value,
  error,
  onChange,
}: {
  question: FormQuestion;
  value: AnswerValue;
  error?: string;
  onChange: (value: AnswerValue) => void;
}) {
  const fieldId = `q-${question.id}`;
  const errorId = `${fieldId}-error`;
  const helpId = `${fieldId}-help`;
  const describedBy = [error ? errorId : null, question.helpText ? helpId : null].filter(Boolean).join(" ") || undefined;

  const baseInputClass = cn(
    "w-full rounded-card border bg-surface px-4 py-3 text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-olive",
    error ? "border-red-600" : "border-border"
  );

  return (
    <div className={question.width === "half" ? "sm:w-1/2" : "w-full"}>
      <label htmlFor={fieldId} className="mb-2 block text-sm font-medium text-ink">
        {question.label}
        {question.required && <span aria-hidden="true"> *</span>}
      </label>
      {question.helpText && (
        <p id={helpId} className="mb-2 text-sm text-muted">
          {question.helpText}
        </p>
      )}

      {renderInput()}

      {error && (
        <p id={errorId} role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );

  function renderInput() {
    switch (question.type) {
      case "longText":
        return (
          <textarea
            id={fieldId}
            rows={4}
            required={question.required}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            placeholder={question.placeholder}
            className={baseInputClass}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
          />
        );

      case "email":
      case "phone":
      case "shortText":
        return (
          <input
            id={fieldId}
            type={question.type === "email" ? "email" : question.type === "phone" ? "tel" : "text"}
            required={question.required}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            placeholder={question.placeholder}
            className={baseInputClass}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
          />
        );

      case "number":
      case "peopleCount":
        return (
          <input
            id={fieldId}
            type="number"
            min={0}
            required={question.required}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            placeholder={question.placeholder}
            className={baseInputClass}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
          />
        );

      case "date":
        return (
          <input
            id={fieldId}
            type="date"
            required={question.required}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            className={baseInputClass}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
          />
        );

      case "select":
        return (
          <select
            id={fieldId}
            required={question.required}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            className={baseInputClass}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
          >
            <option value="" disabled>
              Selecciona una opción
            </option>
            {question.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case "yesNo":
        return (
          <div className="flex gap-3" role="radiogroup" aria-describedby={describedBy}>
            {[
              { value: "yes", label: "Sí" },
              { value: "no", label: "No" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                aria-pressed={value === opt.value}
                onClick={() => onChange(opt.value)}
                className={cn(
                  "rounded-pill border px-5 py-2 text-sm transition",
                  value === opt.value ? "border-ink bg-ink text-background" : "border-border text-text hover:border-ink"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        );

      case "singleChoice":
        return (
          <div className="flex flex-wrap gap-3" role="radiogroup" aria-describedby={describedBy}>
            {question.options?.map((opt) => (
              <button
                key={opt.value}
                type="button"
                aria-pressed={value === opt.value}
                onClick={() => onChange(opt.value)}
                className={cn(
                  "rounded-pill border px-5 py-2 text-sm transition",
                  value === opt.value ? "border-ink bg-ink text-background" : "border-border text-text hover:border-ink"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        );

      case "multiSelect":
      case "checkbox": {
        const selected = Array.isArray(value) ? value : [];
        return (
          <div className="flex flex-wrap gap-3" aria-describedby={describedBy}>
            {question.options?.map((opt) => {
              const checked = selected.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={checked}
                  onClick={() => onChange(checked ? selected.filter((v) => v !== opt.value) : [...selected, opt.value])}
                  className={cn(
                    "rounded-pill border px-5 py-2 text-sm transition",
                    checked ? "border-ink bg-ink text-background" : "border-border text-text hover:border-ink"
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        );
      }

      case "optionCards": {
        const selected = Array.isArray(value) ? value : [];
        return (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3" aria-describedby={describedBy}>
            {question.options?.map((opt) => {
              const checked = selected.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={checked}
                  onClick={() => onChange(checked ? selected.filter((v) => v !== opt.value) : [...selected, opt.value])}
                  className={cn(
                    "rounded-card border p-4 text-left transition",
                    checked ? "border-ink bg-ink text-background" : "border-border text-text hover:border-ink"
                  )}
                >
                  <span className="block text-sm font-medium">{opt.label}</span>
                  {opt.description && <span className="mt-1 block text-xs opacity-80">{opt.description}</span>}
                </button>
              );
            })}
          </div>
        );
      }

      default:
        return null;
    }
  }
}
