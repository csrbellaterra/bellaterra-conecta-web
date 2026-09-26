/**
 * Migración EXPLÍCITA y aprobada de contenido de formularios (Fase 6,
 * corrección posterior al backfill). A diferencia de
 * scripts/backfill-form-questions.ts (que solo AÑADE preguntas que no
 * existían), este script CAMBIA el valor de campos concretos de
 * preguntas que ya existen — porque Aleix ha aprobado explícitamente
 * cada uno de esos cambios como decisión funcional de negocio, no
 * como inferencia mía. Cada cambio de este archivo corresponde a una
 * instrucción literal y con alcance cerrado (ver el mensaje de
 * corrección de Fase 6 — sección por sección abajo).
 *
 * Reglas de esta migración (no negociables):
 *   - Identifica cada pregunta por PAREJA (form slug, question id) —
 *     nunca por posición ni por título.
 *   - Solo usa `client.patch(formId).set({ "questions[_key==\"id\"].campo": valor })`
 *     sobre UN campo de UNA pregunta ya existente — nunca
 *     `createOrReplace`, nunca reescribe el array `questions` entero,
 *     nunca toca preguntas que no están explícitamente listadas aquí.
 *   - Si la pregunta objetivo todavía no existe en Sanity (por
 *     ejemplo porque scripts/backfill-form-questions.ts no se ha
 *     ejecutado todavía), se OMITE con un aviso — nunca se crea aquí:
 *     crear preguntas nuevas es responsabilidad exclusiva del
 *     backfill, no de esta migración.
 *   - Idempotente: ejecutarlo varias veces dejaría el mismo resultado
 *     (cada `set` sobreescribe con el mismo valor final).
 *
 * Uso:
 *   1. Asegúrate de tener SANITY_API_WRITE_TOKEN en .env.local.
 *   2. (Recomendado) Ejecuta primero pnpm sanity:backfill-form-questions,
 *      para que las preguntas nuevas (tipo_jornada, que_celebras,
 *      experiencia_vinculada, intereses_comunidad, otra_experiencia,
 *      tipo_otra_experiencia) ya existan antes de alinear sus opciones.
 *   3. Ejecuta: pnpm sanity:align-forms-v2
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

type OptionInput = { value: string; label: string };
function optionSet(options: OptionInput[]) {
  return options.map((opt) => ({ _type: "formOption", _key: opt.value, value: opt.value, label: opt.label }));
}

/** Un cambio puntual: en `formId`, sobre la pregunta con `_key == questionKey`, fija `field` a `value` — sin tocar nada más de esa pregunta ni del resto del formulario. */
type FieldChange = {
  formId: string;
  questionKey: string;
  questionLabel: string; // solo para el log, no se escribe
  field: string;
  value: unknown;
  description: string;
};

const CHANGES: FieldChange[] = [
  // ---------------- GENERAL ----------------
  {
    formId: "form-general",
    questionKey: "mensaje",
    questionLabel: "Mensaje",
    field: "required",
    value: true,
    description: '"mensaje" pasa a ser obligatorio en el formulario general.',
  },

  // ---------------- PICKLEBALL ----------------
  {
    formId: "form-pickleball",
    questionKey: "nivel",
    questionLabel: "Nivel",
    field: "options",
    value: optionSet([
      { value: "nunca_he_jugado", label: "Nunca he jugado" },
      { value: "principiante", label: "Principiante" },
      { value: "ocasional", label: "Juego ocasionalmente" },
      { value: "habitual", label: "Juego habitualmente" },
    ]),
    description: '"nivel" pasa a la escala exacta Nunca he jugado / Principiante / Juego ocasionalmente / Juego habitualmente (se elimina Iniciación/Intermedio/Avanzado).',
  },
  {
    formId: "form-pickleball",
    questionKey: "quiero",
    questionLabel: "Quiero…",
    field: "options",
    value: optionSet([
      { value: "reservar_pista", label: "Reservar pista" },
      { value: "actividad_grupo", label: "Organizar actividad de grupo" },
      { value: "participar_encuentro", label: "Participar en un encuentro" },
    ]),
    description: '"quiero" pasa a Reservar pista / Organizar actividad de grupo / Participar en un encuentro (sin escuela ni matrícula, que ya no existían).',
  },

  // ---------------- ESTANCIAS ----------------
  {
    formId: "form-estancias",
    questionKey: "tipo_estancia",
    questionLabel: "Tipo de estancia",
    field: "options",
    value: optionSet([
      { value: "habitacion", label: "Habitación privada" },
      { value: "vinculada_experiencia", label: "Alojamiento vinculado a una celebración/experiencia" },
      { value: "casa_completa", label: "Casa completa" },
    ]),
    description: '"tipo_estancia" pasa a Habitación privada / Alojamiento vinculado a una celebración-experiencia / Casa completa.',
  },
  {
    formId: "form-estancias",
    questionKey: "experiencia_vinculada",
    questionLabel: "¿A qué experiencia está vinculada?",
    field: "conditionalLogic.value",
    value: "vinculada_experiencia",
    description:
      'La condición de "experiencia_vinculada" se sincroniza con el nuevo valor de "tipo_estancia" (antes "vinculada_evento", ahora "vinculada_experiencia") — solo se aplica si esta pregunta ya existe (ver sanity:backfill-form-questions).',
  },

  // ---------------- EMPRESAS ----------------
  {
    formId: "form-empresas",
    questionKey: "tipo_jornada",
    questionLabel: "¿Qué queréis organizar?",
    field: "options",
    value: optionSet([
      { value: "reunion", label: "Reunión" },
      { value: "formacion", label: "Formación" },
      { value: "workshop", label: "Workshop" },
      { value: "presentacion", label: "Presentación" },
      { value: "jornada_equipo", label: "Jornada de equipo" },
      { value: "otro", label: "Otro" },
    ]),
    description: '"tipo_jornada" confirmado en Reunión / Formación / Workshop / Presentación / Jornada de equipo / Otro (solo se aplica si esta pregunta ya existe).',
  },
  {
    formId: "form-empresas",
    questionKey: "que_incluir",
    questionLabel: "¿Qué os gustaría incluir?",
    field: "options",
    value: optionSet([
      { value: "restauracion", label: "Restauración" },
      { value: "pickleball", label: "Pickleball" },
      { value: "jardin_exterior", label: "Jardín / exterior" },
      { value: "piscina", label: "Piscina" },
      { value: "alojamiento", label: "Alojamiento" },
      { value: "otro", label: "Otro" },
    ]),
    description: '"que_incluir" (Empresas) pasa a Restauración / Pickleball / Jardín-exterior / Piscina / Alojamiento / Otro (se elimina el set anterior, distinto).',
  },

  // ---------------- EVENTOS ----------------
  {
    formId: "form-eventos",
    questionKey: "que_celebras",
    questionLabel: "¿Qué quieres celebrar?",
    field: "options",
    value: optionSet([
      { value: "cumpleanos", label: "Cumpleaños" },
      { value: "aniversario", label: "Aniversario" },
      { value: "celebracion_familiar", label: "Celebración familiar" },
      { value: "comunion", label: "Comunión" },
      { value: "encuentro_especial", label: "Encuentro especial" },
      { value: "otro", label: "Otro" },
    ]),
    description: '"que_celebras" confirmado en Cumpleaños / Aniversario / Celebración familiar / Comunión / Encuentro especial / Otro (solo se aplica si esta pregunta ya existe).',
  },
  {
    formId: "form-eventos",
    questionKey: "que_incluir",
    questionLabel: "¿Qué te gustaría incluir?",
    field: "options",
    value: optionSet([
      { value: "restauracion", label: "Restauración" },
      { value: "jardin_exterior", label: "Jardín / exterior" },
      { value: "piscina", label: "Piscina" },
      { value: "barbacoa", label: "Barbacoa" },
      { value: "pickleball", label: "Pickleball" },
      { value: "alojamiento", label: "Alojamiento" },
    ]),
    description: '"que_incluir" (Eventos) pasa a Restauración / Jardín-exterior / Piscina / Barbacoa / Pickleball / Alojamiento (se elimina el set anterior, distinto).',
  },
];

type ExistingForm = { _id: string; questions?: { _key?: string; id?: string }[] | null } | null;

async function run() {
  console.log(`\nAlineando formularios V2 (dataset "${dataset}") — solo preguntas conocidas por (form, id)...\n`);

  // Agrupa por formId para leer cada formulario una sola vez.
  const byForm = new Map<string, FieldChange[]>();
  for (const change of CHANGES) {
    if (!byForm.has(change.formId)) byForm.set(change.formId, []);
    byForm.get(change.formId)!.push(change);
  }

  for (const [formId, changes] of byForm) {
    const existing = await client.fetch<ExistingForm>(`*[_type == "form" && _id == $id][0]{ _id, questions[]{ _key, id } }`, { id: formId });

    if (!existing) {
      console.log(`  – ${formId}: el formulario no existe todavía — se omite por completo.`);
      continue;
    }

    const existingKeys = new Set((existing.questions ?? []).map((q) => q?._key || q?.id).filter((k): k is string => Boolean(k)));

    for (const change of changes) {
      if (!existingKeys.has(change.questionKey)) {
        console.log(`  – ${formId} / "${change.questionKey}": la pregunta no existe todavía — se omite (no se crea aquí).`);
        continue;
      }

      const selector = `questions[_key == "${change.questionKey}"].${change.field}`;
      await client.patch(formId).set({ [selector]: change.value }).commit();
      console.log(`  ✔ ${formId} / "${change.questionKey}".${change.field} — ${change.description}`);
    }
  }

  console.log("\nListo. Ninguna otra pregunta, formulario ni campo se ha tocado.\n");
}

run().catch((error) => {
  console.error("\n✖ La alineación ha fallado:\n");
  console.error(error);
  process.exit(1);
});
