/**
 * Backfill NO destructivo de los 7 formularios (Fase 6). Añade
 * preguntas que la nueva especificación pide y que hoy no existen en
 * el formulario correspondiente — identificadas por `id` — sin tocar
 * nunca una pregunta ya existente (ni su tipo, ni sus opciones, ni si
 * es obligatoria). Nunca usa `createOrReplace`: cada formulario ya
 * creado por scripts/create-forms.ts (o editado a mano en /studio)
 * queda intacto salvo por la inserción puntual de las preguntas
 * listadas abajo, y solo si su `id` no está ya presente.
 *
 * Qué añade, y por qué (ver informe de Fase 6 para el detalle
 * completo pregunta a pregunta):
 *   - form-empresas: "¿Qué queréis organizar?" (tipo_jornada) — la
 *     spec pide esta pregunta de opción única; no existía.
 *   - form-eventos: "¿Qué quieres celebrar?" (que_celebras) — la spec
 *     pide opción única con una lista cerrada; el campo existente
 *     "tipo_celebracion" es texto libre y se deja tal cual (no se
 *     borra ni se convierte).
 *   - form-estancias: "¿A qué experiencia está vinculada?"
 *     (experiencia_vinculada), condicional a que "tipo_estancia" sea
 *     "vinculada_evento" — no existía ninguna pregunta condicional.
 *   - form-comunidad: "¿Qué te interesa?" (intereses_comunidad) como
 *     selección múltiple con la lista cerrada de la spec; el campo
 *     existente "que_te_interesa" es texto libre y se deja tal cual.
 *   - form-pickleball: "¿Forma parte de otra experiencia?"
 *     (otra_experiencia, sí/no) y su condicional
 *     "tipo_otra_experiencia" (Empresa/Evento/Comunidad/Otra) — no
 *     existía ninguna de las dos.
 *   - form-family-day y form-general: sin preguntas nuevas que añadir
 *     (ver informe — form-general tiene una decisión pendiente sobre
 *     si "mensaje" debería pasar a obligatorio, que este script
 *     deliberadamente NO fuerza).
 *
 * Uso:
 *   1. Asegúrate de tener SANITY_API_WRITE_TOKEN en .env.local.
 *   2. Ejecuta: pnpm sanity:backfill-form-questions
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

type QuestionInput = {
  id: string;
  type: string;
  label: string;
  required?: boolean;
  helpText?: string;
  step?: number;
  width?: "full" | "half";
  options?: { value: string; label: string }[];
  conditionalLogic?: { dependsOnQuestionId: string; condition: "equals" | "notEquals" | "contains"; value: string };
};

function buildQuestion(input: QuestionInput) {
  return {
    _type: "formQuestion",
    _key: input.id,
    id: input.id,
    type: input.type,
    label: input.label,
    required: input.required ?? true,
    helpText: input.helpText,
    step: input.step,
    width: input.width ?? "full",
    options: input.options?.map((opt) => ({ _type: "formOption", _key: opt.value, value: opt.value, label: opt.label })),
    conditionalLogic: input.conditionalLogic
      ? { _type: "object", dependsOnQuestionId: input.conditionalLogic.dependsOnQuestionId, condition: input.conditionalLogic.condition, value: input.conditionalLogic.value }
      : undefined,
  };
}

const BACKFILL: { formId: string; questions: QuestionInput[] }[] = [
  {
    formId: "form-empresas",
    questions: [
      buildQuestion({
        id: "tipo_jornada",
        type: "singleChoice",
        label: "¿Qué queréis organizar?",
        step: 2,
        options: [
          { value: "reunion", label: "Reunión" },
          { value: "formacion", label: "Formación" },
          { value: "workshop", label: "Workshop" },
          { value: "presentacion", label: "Presentación" },
          { value: "jornada_equipo", label: "Jornada de equipo" },
          { value: "otro", label: "Otro" },
        ],
      }),
    ],
  },
  {
    formId: "form-eventos",
    questions: [
      buildQuestion({
        id: "que_celebras",
        type: "singleChoice",
        label: "¿Qué quieres celebrar?",
        step: 2,
        options: [
          { value: "cumpleanos", label: "Cumpleaños" },
          { value: "aniversario", label: "Aniversario" },
          { value: "celebracion_familiar", label: "Celebración familiar" },
          { value: "comunion", label: "Comunión" },
          { value: "encuentro_especial", label: "Encuentro especial" },
          { value: "otro", label: "Otro" },
        ],
      }),
    ],
  },
  {
    formId: "form-estancias",
    questions: [
      buildQuestion({
        id: "experiencia_vinculada",
        type: "singleChoice",
        label: "¿A qué experiencia está vinculada?",
        step: 2,
        options: [
          { value: "evento", label: "Evento" },
          { value: "empresa", label: "Empresa" },
          { value: "comunidad", label: "Comunidad" },
          { value: "otra", label: "Otra" },
        ],
        conditionalLogic: { dependsOnQuestionId: "tipo_estancia", condition: "equals", value: "vinculada_experiencia" },
      }),
    ],
  },
  {
    formId: "form-comunidad",
    questions: [
      buildQuestion({
        id: "intereses_comunidad",
        type: "multiSelect",
        label: "¿Qué te interesa?",
        required: false,
        step: 2,
        options: [
          { value: "family_days", label: "Family Days" },
          { value: "actividades", label: "Actividades" },
          { value: "deporte", label: "Deporte" },
          { value: "iniciativas_sociales_ambientales", label: "Iniciativas sociales y ambientales" },
          { value: "conocer_comunidad", label: "Conocer mejor la Comunidad" },
        ],
      }),
    ],
  },
  {
    formId: "form-pickleball",
    questions: [
      buildQuestion({
        id: "otra_experiencia",
        type: "yesNo",
        label: "¿Forma parte de otra experiencia?",
        required: false,
        step: 2,
      }),
      buildQuestion({
        id: "tipo_otra_experiencia",
        type: "singleChoice",
        label: "¿De qué experiencia se trata?",
        step: 2,
        options: [
          { value: "empresa", label: "Empresa" },
          { value: "evento", label: "Evento" },
          { value: "comunidad", label: "Comunidad" },
          { value: "otra", label: "Otra" },
        ],
        conditionalLogic: { dependsOnQuestionId: "otra_experiencia", condition: "equals", value: "yes" },
      }),
    ],
  },
];

type ExistingForm = { _id: string; questions?: { id?: string }[] | null } | null;

async function run() {
  console.log(`\nBackfill no destructivo de preguntas de formulario (dataset "${dataset}")...\n`);

  for (const { formId, questions } of BACKFILL) {
    const existing = await client.fetch<ExistingForm>(`*[_type == "form" && _id == $id][0]{ _id, questions[]{ id } }`, { id: formId });

    if (!existing) {
      console.log(`  – ${formId}: no existe todavía (ejecuta primero pnpm sanity:create-forms) — se omite.`);
      continue;
    }

    const existingIds = new Set((existing.questions ?? []).map((q) => q?.id).filter((id): id is string => Boolean(id)));
    const missing = questions.filter((q) => !existingIds.has(q.id));

    if (missing.length === 0) {
      console.log(`  ✔ ${formId}: todas las preguntas del backfill ya existen — no se toca nada.`);
      continue;
    }

    for (const question of missing) {
      const built = buildQuestion(question);
      await client.patch(formId).setIfMissing({ questions: [] }).insert("after", "questions[-1]", [built]).commit();
      console.log(`  ✔ ${formId}: añadida la pregunta "${question.id}" (${question.label}).`);
    }
  }

  console.log("\nListo. El resto de preguntas y campos de cada formulario no se han tocado.\n");
}

run().catch((error) => {
  console.error("\n✖ El backfill ha fallado:\n");
  console.error(error);
  process.exit(1);
});
