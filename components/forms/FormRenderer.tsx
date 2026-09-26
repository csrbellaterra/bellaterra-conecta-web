"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";

import { cn } from "@/lib/utils";
import type { Event, FormDoc, FormQuestion } from "@/types/content";

/**
 * Motor de formularios V2 (Fase 6): interpreta un documento `form` de
 * Sanity (título, preguntas con tipo/opciones/lógica
 * condicional/paso, títulos de paso) y renderiza un formulario
 * funcional, accesible, en varios pasos, con una experiencia cercana
 * a Typeform pero dentro del lenguaje visual de Bellaterra Conecta
 * (sin estética SaaS): progreso visible, opciones grandes tocables,
 * un paso a la vez cuando el formulario los define.
 *
 * Responsabilidades de Sanity vs. código (ver CLAUDE.md / spec Fase
 * 6): Sanity controla título, intro, preguntas, opciones,
 * obligatoriedad, orden, pasos y su título, texto del botón y texto
 * de éxito si existe. El código controla layout, validación,
 * envío, seguridad y Airtable — esto no es un page builder.
 *
 * Seguimiento de origen: en vez de colar eventId/eventTitle/eventDate
 * /ctaSource/UTMs dentro de `answers` (como en fases anteriores), aquí
 * viajan en un objeto `tracking` aparte y estructurado — nunca se
 * muestran al usuario y nunca dependen de que el usuario rellene un
 * campo de texto libre para identificar un evento.
 */

type AnswerValue = string | string[] | boolean | undefined;
type Answers = Record<string, AnswerValue>;

type TrackingMetadata = {
  ctaSource?: string;
  eventId?: string;
  eventTitle?: string;
  eventDate?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  sourceUrl?: string;
};

const DATE_FORMATTER = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric" });

function formatEventDate(isoDate: string): string {
  try {
    return DATE_FORMATTER.format(new Date(`${isoDate}T00:00:00`));
  } catch {
    return isoDate;
  }
}

function isVisible(question: FormQuestion, answers: Answers): boolean {
  const cond = question.conditionalLogic;
  if (!cond?.dependsOnQuestionId) return true;
  const dependsValue = answers[cond.dependsOnQuestionId];
  const compareValue = cond.value ?? "";

  if (cond.condition === "contains") {
    if (Array.isArray(dependsValue)) return dependsValue.includes(compareValue);
    return String(dependsValue ?? "").includes(compareValue);
  }

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

/** Texto de confirmación contextual por formulario, usado SOLO si el `successText` editado en Sanity está vacío — Sanity sigue siendo la fuente principal (ver documents/form.ts). No prometemos plazos de respuesta si no están definidos. */
const SUCCESS_FALLBACK: Record<string, string> = {
  empresas: "Nos pondremos en contacto contigo para conocer mejor la jornada.",
  eventos: "Revisaremos la información y te contactaremos para hablar de tu celebración.",
  estancias: "Revisaremos disponibilidad y te contactaremos en breve.",
  comunidad: "Te contactaremos para contarte cómo formar parte de la Comunidad.",
  pickleball: "Te contactaremos para confirmar los detalles.",
  "family-day": "Tu solicitud para el Family Day ha sido recibida.",
  general: "Hemos recibido tu mensaje.",
};

/** Id de pregunta reservado por convención para la fecha del Family Day (ver scripts/create-forms.ts). Fase 6: ya NO es la fuente principal de identificación del evento — se oculta y se autorrellena de forma legible solo para que answersJson/Airtable conserven un valor de texto, pero el evento real viaja siempre en `tracking`. */
const FAMILY_DAY_DATE_QUESTION_ID = "fecha_family_day";

export default function FormRenderer({
  form,
  pageSource,
  ctaSource,
  familyDayPreselected,
  familyDayUpcoming,
}: {
  form: FormDoc;
  pageSource?: string;
  /** Origen del CTA que trajo al usuario aquí (ej. "visita", "contacto-general"), resuelto server-side desde ?ctaSource= — ver app/solicitud/[slug]/page.tsx. */
  ctaSource?: string;
  /** Solo para el formulario "family-day": evento ya resuelto server-side a partir de ?eventId= (que es en realidad el slug del evento, ver DoorUpcomingFamilyDays). */
  familyDayPreselected?: { id: string; title: string; date: string } | null;
  /** Solo para el formulario "family-day" sin evento preseleccionado: próximos Family Days publicados, para que el usuario elija uno. */
  familyDayUpcoming?: Event[];
}) {
  const isFamilyDayForm = form.slug === "family-day";

  // Preguntas visibles del formulario, excluyendo la de fecha en texto
  // libre del Family Day (superada por el banner/selector estructurado
  // de más abajo) — nunca se elimina de Sanity, solo se oculta aquí.
  const renderableQuestions = useMemo(
    () => (isFamilyDayForm ? form.questions.filter((q) => q.id !== FAMILY_DAY_DATE_QUESTION_ID) : form.questions),
    [form.questions, isFamilyDayForm]
  );

  const steps = useMemo(() => getSteps(renderableQuestions), [renderableQuestions]);
  const isMultiStep = steps.length > 1;
  const stepTitleByNumber = useMemo(() => {
    const map = new Map<number, string>();
    for (const s of form.steps ?? []) map.set(s.step, s.title);
    return map;
  }, [form.steps]);

  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Family Day sin evento preseleccionado: el usuario debe elegir uno
  // de los próximos publicados antes de poder enviar. No es una
  // pregunta de Sanity, es una selección estructurada.
  const [selectedFamilyDay, setSelectedFamilyDay] = useState<Event | null>(null);
  const [familyDayError, setFamilyDayError] = useState<string | null>(null);

  const resolvedFamilyDayEvent: { id: string; title: string; date: string } | null = familyDayPreselected
    ? familyDayPreselected
    : selectedFamilyDay
      ? { id: selectedFamilyDay.slug, title: selectedFamilyDay.title, date: selectedFamilyDay.date }
      : null;

  // Preselección desde la URL (ej. un CTA que enlaza con
  // ?nombre=...): rellena cualquier pregunta cuyo id coincida con un
  // parámetro de la URL. Genérico para cualquier formulario. Se aplica
  // en un efecto (no en el useState inicial) para no desajustar el
  // HTML ya renderizado en servidor.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const prefilled: Answers = {};
    for (const question of renderableQuestions) {
      const value = params.get(question.id);
      if (value) prefilled[question.id] = value;
    }
    if (Object.keys(prefilled).length > 0) {
      setAnswers((prev) => ({ ...prefilled, ...prev }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderableQuestions]);

  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [marketingAccepted, setMarketingAccepted] = useState(false);
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
      const empty = isAnswerEmpty(value);

      if (q.required && empty) {
        nextErrors[q.id] = "Este campo es obligatorio.";
        continue;
      }
      if (empty) continue; // opcional y vacío: nada más que validar

      if (q.type === "email" && typeof value === "string" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        nextErrors[q.id] = "Introduce un email válido.";
      }

      if (q.type === "phone" && typeof value === "string" && !/^[+\d][\d\s()-]{5,19}$/.test(value.trim())) {
        nextErrors[q.id] = "Introduce un teléfono válido.";
      }

      if ((q.type === "number" || q.type === "peopleCount") && typeof value === "string") {
        const num = Number(value);
        if (!Number.isFinite(num) || num < 1) {
          nextErrors[q.id] = "Introduce un número igual o mayor que 1.";
        }
      }

      if (q.type === "date" && typeof value === "string" && Number.isNaN(new Date(value).getTime())) {
        nextErrors[q.id] = "Introduce una fecha válida.";
      }

      if (q.type === "yesNo" && typeof value === "string" && !["yes", "no"].includes(value)) {
        nextErrors[q.id] = "Selecciona una opción válida.";
      }

      const optionBased = ["select", "singleChoice", "multiSelect", "checkbox", "optionCards"];
      if (optionBased.includes(q.type) && q.options && q.options.length > 0) {
        const allowed = new Set(q.options.map((o) => o.value));
        const submitted = Array.isArray(value) ? value : [value as string];
        if (submitted.some((v) => !allowed.has(v))) {
          nextErrors[q.id] = "Selecciona una opción válida.";
        }
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

    const allVisibleQuestions = renderableQuestions.filter((q) => isVisible(q, answers));
    if (!validateQuestions(isMultiStep ? currentQuestions : allVisibleQuestions)) return;

    if (isFamilyDayForm && !resolvedFamilyDayEvent) {
      setFamilyDayError("Elige a qué Family Day te apuntas antes de continuar.");
      return;
    }
    setFamilyDayError(null);

    if (!privacyAccepted) {
      setSubmitError("Debes aceptar la Política de Privacidad para continuar.");
      return;
    }

    setStatus("submitting");
    setSubmitError(null);

    const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;

    const tracking: TrackingMetadata = {
      ctaSource: ctaSource ?? params?.get("ctaSource") ?? undefined,
      eventId: resolvedFamilyDayEvent?.id,
      eventTitle: resolvedFamilyDayEvent?.title,
      eventDate: resolvedFamilyDayEvent?.date,
      utmSource: params?.get("utm_source") ?? undefined,
      utmMedium: params?.get("utm_medium") ?? undefined,
      utmCampaign: params?.get("utm_campaign") ?? undefined,
      sourceUrl: typeof window !== "undefined" ? window.location.href : undefined,
    };

    const answersToSend = allVisibleQuestions.map((q) => ({
      questionId: q.id,
      questionLabel: q.label,
      answer: answers[q.id] ?? "",
    }));

    // Compatibilidad: si el formulario Family Day sigue teniendo la
    // pregunta de texto libre "fecha_family_day" en Sanity (no se
    // borra el schema), se autorrellena con la fecha resuelta de forma
    // legible para que answersJson/Airtable conserven un valor útil,
    // aunque la pregunta ya no se muestre ni se pida al usuario.
    if (isFamilyDayForm && resolvedFamilyDayEvent) {
      const dateQuestion = form.questions.find((q) => q.id === FAMILY_DAY_DATE_QUESTION_ID);
      if (dateQuestion) {
        answersToSend.push({
          questionId: dateQuestion.id,
          questionLabel: dateQuestion.label,
          answer: formatEventDate(resolvedFamilyDayEvent.date),
        });
      }
    }

    try {
      const res = await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formSlug: form.slug,
          formTitle: form.title,
          pageSource: pageSource ?? (typeof window !== "undefined" ? window.location.pathname : undefined),
          answers: answersToSend,
          tracking,
          privacyAccepted,
          marketingAccepted,
          website: honeypot,
        }),
      });

      const body = await res.json().catch(() => ({ ok: false }));
      if (!res.ok || !body.ok) {
        throw new Error(body.error || "No se ha podido enviar el formulario.");
      }

      setStatus("success");
    } catch {
      // Copy fijo y genérico en el estado de error (ver spec Fase 6):
      // no repetimos el mensaje crudo del servidor al usuario, y nunca
      // se borran las respuestas ya introducidas.
      setStatus("error");
      setSubmitError("No hemos podido enviar tu solicitud. Inténtalo de nuevo o escríbenos a hola@bellaterraconecta.com.");
    }
  }

  if (status === "success") {
    const successText = form.successText || SUCCESS_FALLBACK[form.slug];
    return (
      <div className="py-10 text-center">
        <h3 className="font-serif text-2xl text-ink">{form.successTitle || "¡Gracias!"}</h3>
        {successText && <p className="mt-3 text-muted">{successText}</p>}
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-pill border border-border px-6 py-3 text-sm font-medium text-text transition hover:border-ink"
        >
          Volver a Bellaterra Conecta
        </Link>
      </div>
    );
  }

  const isLastStep = stepIndex === steps.length - 1;
  const currentStepNumber = steps[stepIndex]?.[0]?.step;
  const currentStepTitle = currentStepNumber !== undefined ? stepTitleByNumber.get(currentStepNumber) : undefined;
  const progressPercent = Math.round(((stepIndex + 1) / steps.length) * 100);

  const ctaContextText =
    ctaSource === "visita"
      ? "Ven a conocer Bellaterra Conecta."
      : ctaSource === "contacto-general"
        ? "Cuéntanos en qué podemos ayudarte."
        : undefined;

  return (
    <div>
      {ctaContextText && <p className="mb-6 font-sans text-sm uppercase tracking-[0.15em] text-olive">{ctaContextText}</p>}

      {isFamilyDayForm && (
        <FamilyDayContext
          preselected={familyDayPreselected}
          upcoming={familyDayUpcoming}
          selected={selectedFamilyDay}
          onSelect={setSelectedFamilyDay}
          error={familyDayError}
        />
      )}

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
          <div className="space-y-2">
            <div className="h-1 w-full overflow-hidden rounded-full bg-border">
              <div className="h-full bg-olive transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
            <p className="font-sans text-xs uppercase tracking-[0.15em] text-muted">
              Paso {stepIndex + 1} de {steps.length}
              {currentStepTitle ? ` — ${currentStepTitle}` : ""}
            </p>
          </div>
        )}

        <div className="space-y-6">
          {currentQuestions.map((question) => (
            <QuestionField
              key={question.id}
              question={question}
              value={answers[question.id]}
              error={errors[question.id]}
              onChange={(v) => setAnswer(question.id, v)}
            />
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
                <a href="/legal/privacidad" className="underline underline-offset-2">
                  Política de Privacidad
                </a>
                .
              </span>
            </label>
            <label className="flex items-start gap-3 text-sm text-muted">
              <input
                type="checkbox"
                checked={marketingAccepted}
                onChange={(e) => setMarketingAccepted(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0"
              />
              <span>Quiero recibir novedades de Bellaterra Conecta (opcional).</span>
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
              disabled={status === "submitting" || (isFamilyDayForm && !resolvedFamilyDayEvent)}
              title={isFamilyDayForm && !resolvedFamilyDayEvent ? "Elige a qué Family Day te apuntas antes de enviar" : undefined}
              className="rounded-pill bg-ink px-6 py-3 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-50"
            >
              {status === "submitting" ? "Enviando…" : form.submitLabel || "Enviar"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

/**
 * Contexto estructurado del Family Day, por encima de las preguntas
 * de Sanity: si hay un evento resuelto server-side (desde ?eventId=,
 * que en realidad es el slug — ver DoorUpcomingFamilyDays), muestra un
 * banner de solo lectura ("TE APUNTAS A") y no vuelve a pedir la
 * fecha. Si no hay evento preseleccionado, muestra un selector con los
 * próximos Family Days publicados en Sanity — nunca un campo de texto
 * libre como fuente principal de identificación del evento.
 */
function FamilyDayContext({
  preselected,
  upcoming,
  selected,
  onSelect,
  error,
}: {
  preselected?: { id: string; title: string; date: string } | null;
  upcoming?: Event[];
  selected: Event | null;
  onSelect: (event: Event) => void;
  error: string | null;
}) {
  if (preselected) {
    return (
      <div className="mb-8 rounded-card border border-olive/40 bg-surface p-5">
        <p className="font-sans text-xs uppercase tracking-[0.2em] text-olive">Te apuntas a</p>
        <p className="mt-1 font-serif text-xl text-ink">
          {preselected.title} — {formatEventDate(preselected.date)}
        </p>
      </div>
    );
  }

  const events = upcoming ?? [];

  if (events.length === 0) {
    return (
      <div className="mb-8 rounded-card border border-border bg-surface p-5">
        <p className="font-sans text-sm text-muted">No hay Family Days publicados en este momento. Escríbenos y te avisamos en cuanto haya nuevas fechas.</p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <p className="mb-3 font-sans text-xs uppercase tracking-[0.2em] text-olive">Elige a qué Family Day te apuntas</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {events.map((event) => {
          const checked = selected?.slug === event.slug;
          return (
            <button
              key={event.slug}
              type="button"
              aria-pressed={checked}
              onClick={() => onSelect(event)}
              className={cn(
                "rounded-card border p-4 text-left transition",
                checked ? "border-ink bg-ink text-background" : "border-border text-text hover:border-ink"
              )}
            >
              <span className="block text-sm font-medium">{event.title}</span>
              <span className="mt-1 block text-xs opacity-80">{formatEventDate(event.date)}</span>
            </button>
          );
        })}
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
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
        return (
          <input
            id={fieldId}
            type="email"
            inputMode="email"
            required={question.required}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            placeholder={question.placeholder}
            className={baseInputClass}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
          />
        );

      case "phone":
        return (
          <input
            id={fieldId}
            type="tel"
            inputMode="tel"
            required={question.required}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            placeholder={question.placeholder}
            className={baseInputClass}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
          />
        );

      case "shortText":
        return (
          <input
            id={fieldId}
            type="text"
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
            inputMode="numeric"
            min={1}
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
