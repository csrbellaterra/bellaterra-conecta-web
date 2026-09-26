/**
 * Crea los formularios iniciales de la V2 (sección 21 del prompt de
 * rediseño): Empresas, Eventos, Estancias, Comunidad, Family Day,
 * Pickleball y General.
 *
 * ADITIVO por diseño: usa `createIfNotExists` con IDs fijos, nunca
 * `createOrReplace`. Si un formulario con ese _id ya existe (por
 * ejemplo porque ya lo has editado desde /studio), este script NO lo
 * toca — así puedes volver a ejecutarlo sin miedo a perder cambios
 * hechos a mano. Para actualizar un formulario ya creado, edítalo
 * directamente en /studio.
 *
 * No toca siteSettings, homePage, door, impact ni page.
 *
 * Uso:
 *   1. Asegúrate de tener SANITY_API_WRITE_TOKEN en .env.local (ver
 *      scripts/seed-sanity.ts para cómo crear el token).
 *   2. Ejecuta: pnpm sanity:create-forms
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
if (!writeToken) fail("Falta SANITY_API_WRITE_TOKEN en .env.local (permisos \"Editor\").");

const client: SanityClient = createClient({ projectId, dataset, apiVersion, token: writeToken, useCdn: false });

// ---------------------------------------------------------------
// Helpers para construir preguntas sin repetir _type/_key a mano
// ---------------------------------------------------------------
type QuestionInput = {
  id: string;
  type: string;
  label: string;
  required?: boolean;
  helpText?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  step?: number;
  width?: "full" | "half";
};

function q(input: QuestionInput) {
  return {
    _type: "formQuestion",
    _key: input.id,
    id: input.id,
    type: input.type,
    label: input.label,
    required: input.required ?? true,
    helpText: input.helpText,
    placeholder: input.placeholder,
    step: input.step,
    width: input.width ?? "full",
    options: input.options?.map((opt) => ({ _type: "formOption", _key: opt.value, value: opt.value, label: opt.label })),
  };
}

const CONTACT_QUESTIONS = (step: number) => [
  q({ id: "nombre", type: "shortText", label: "Nombre", step, width: "half" }),
  q({ id: "email", type: "email", label: "Email", step, width: "half" }),
  q({ id: "telefono", type: "phone", label: "Teléfono", step, required: false, width: "half" }),
];

// ---------------------------------------------------------------
// Definición de los 7 formularios iniciales
// ---------------------------------------------------------------
const forms = [
  {
    _id: "form-empresas",
    slug: "empresas",
    title: "Solicitud — Empresas",
    submitLabel: "Enviar solicitud",
    introTitle: "Cuéntanos sobre vuestra jornada",
    introText: "Con estos datos podemos preparar una propuesta a medida para vuestro equipo.",
    successTitle: "¡Gracias!",
    successText: "Hemos recibido vuestra solicitud. Os contactaremos en menos de 48h.",
    questions: [
      q({ id: "nombre", type: "shortText", label: "Nombre", step: 1, width: "half" }),
      q({ id: "empresa", type: "shortText", label: "Empresa", step: 1, width: "half" }),
      q({ id: "email", type: "email", label: "Email", step: 1, width: "half" }),
      q({ id: "telefono", type: "phone", label: "Teléfono", step: 1, required: false, width: "half" }),
      q({ id: "fecha_aproximada", type: "date", label: "Fecha aproximada", step: 2, required: false, width: "half" }),
      q({ id: "num_personas", type: "peopleCount", label: "Número de personas", step: 2, width: "half" }),
      q({ id: "objetivo_jornada", type: "longText", label: "Objetivo de la jornada", step: 2, required: false }),
      q({
        id: "que_incluir",
        type: "optionCards",
        label: "¿Qué quieres incluir?",
        required: false,
        step: 3,
        options: [
          { value: "trabajo_reunion", label: "Trabajo / reunión" },
          { value: "restauracion", label: "Restauración" },
          { value: "exterior", label: "Exterior" },
          { value: "pickleball", label: "Pickleball" },
          { value: "alojamiento", label: "Alojamiento" },
          { value: "piscina", label: "Piscina" },
          { value: "otros", label: "Otros" },
        ],
      }),
      q({ id: "mensaje", type: "longText", label: "Mensaje", step: 3, required: false }),
    ],
  },
  {
    _id: "form-eventos",
    slug: "eventos",
    title: "Solicitud — Eventos",
    submitLabel: "Enviar solicitud",
    introTitle: "Cuéntanos sobre vuestra celebración",
    introText: "Con estos datos podemos preparar una propuesta a medida para vuestro evento.",
    successTitle: "¡Gracias!",
    successText: "Hemos recibido vuestra solicitud. Os contactaremos en menos de 48h.",
    questions: [
      ...CONTACT_QUESTIONS(1),
      q({
        id: "tipo_celebracion",
        type: "shortText",
        label: "Tipo de celebración",
        step: 2,
        placeholder: "Ej. boda, cumpleaños, celebración de empresa…",
      }),
      q({ id: "fecha", type: "date", label: "Fecha", step: 2, required: false, width: "half" }),
      q({ id: "num_personas", type: "peopleCount", label: "Número aproximado de personas", step: 2, width: "half" }),
      q({
        id: "que_incluir",
        type: "optionCards",
        label: "¿Qué quieres incluir?",
        required: false,
        step: 3,
        options: [
          { value: "interior", label: "Interior" },
          { value: "terraza", label: "Terraza" },
          { value: "jardin", label: "Jardín" },
          { value: "piscina", label: "Piscina" },
          { value: "barbacoa", label: "Barbacoa" },
          { value: "restauracion", label: "Restauración" },
          { value: "pickleball", label: "Pickleball" },
          { value: "alojamiento", label: "Alojamiento" },
        ],
      }),
      q({ id: "mensaje", type: "longText", label: "Mensaje", step: 3, required: false }),
    ],
  },
  {
    _id: "form-estancias",
    slug: "estancias",
    title: "Solicitud — Estancias",
    submitLabel: "Enviar solicitud",
    introTitle: "Cuéntanos cuándo os gustaría venir",
    introText: "Con estos datos comprobamos disponibilidad y os preparamos una propuesta.",
    successTitle: "¡Gracias!",
    successText: "Hemos recibido vuestra solicitud. Os contactaremos en menos de 48h.",
    questions: [
      ...CONTACT_QUESTIONS(1),
      q({ id: "fecha_entrada", type: "date", label: "Fecha de entrada", step: 2, width: "half" }),
      q({ id: "fecha_salida", type: "date", label: "Fecha de salida", step: 2, width: "half" }),
      q({ id: "num_huespedes", type: "peopleCount", label: "Número de huéspedes", step: 2 }),
      q({
        id: "tipo_estancia",
        type: "singleChoice",
        label: "Tipo de estancia",
        step: 2,
        options: [
          { value: "habitacion", label: "Habitación privada" },
          { value: "vinculada_evento", label: "Vinculada a experiencia" },
          { value: "estancia_privada", label: "Estancia privada" },
        ],
      }),
      q({ id: "mensaje", type: "longText", label: "Mensaje", step: 3, required: false }),
    ],
  },
  {
    _id: "form-comunidad",
    slug: "comunidad",
    title: "Solicitud — Comunidad",
    submitLabel: "Enviar",
    introTitle: "Cuéntanos qué te interesa",
    introText: "Te contamos cómo formar parte de Comunidad.",
    successTitle: "¡Gracias!",
    successText: "Hemos recibido tu mensaje. Te contactaremos en menos de 48h.",
    questions: [
      ...CONTACT_QUESTIONS(1),
      q({ id: "que_te_interesa", type: "longText", label: "¿Qué te interesa?", step: 2, required: false }),
      q({ id: "mensaje", type: "longText", label: "Mensaje", step: 2, required: false }),
    ],
  },
  {
    _id: "form-family-day",
    slug: "family-day",
    title: "Inscripción — Family Day",
    submitLabel: "Apuntarme",
    introTitle: "Apúntate a un Family Day",
    introText: "Indícanos a qué Family Day queréis venir y cuántos sois.",
    successTitle: "¡Nos vemos en el Family Day!",
    successText: "Hemos recibido tu inscripción. Te confirmaremos por email.",
    questions: [
      ...CONTACT_QUESTIONS(1),
      q({ id: "fecha_family_day", type: "shortText", label: "Fecha del Family Day", step: 2 }),
      q({ id: "num_participantes", type: "peopleCount", label: "Número de participantes", step: 2, width: "half" }),
      q({ id: "adultos", type: "number", label: "Adultos", step: 2, required: false, width: "half" }),
      q({ id: "ninos", type: "number", label: "Niños", step: 2, required: false, width: "half" }),
      q({ id: "actividades_interes", type: "longText", label: "Actividades de interés", step: 3, required: false }),
      q({ id: "mensaje", type: "longText", label: "Mensaje", step: 3, required: false }),
    ],
  },
  {
    _id: "form-pickleball",
    slug: "pickleball",
    title: "Solicitud — Pickleball",
    submitLabel: "Enviar",
    introTitle: "Cuéntanos qué quieres hacer",
    introText: "Reservar pista, apuntarte a un Family Day o organizar algo en grupo.",
    successTitle: "¡Gracias!",
    successText: "Hemos recibido tu solicitud. Te contactaremos en menos de 48h.",
    questions: [
      ...CONTACT_QUESTIONS(1),
      q({
        id: "quiero",
        type: "singleChoice",
        label: "Quiero…",
        step: 2,
        options: [
          { value: "reservar_pista", label: "Reservar pista" },
          { value: "family_day", label: "Participar en un Family Day" },
          { value: "grupo", label: "Actividad para grupo" },
        ],
      }),
      q({ id: "fecha_aproximada", type: "date", label: "Fecha aproximada", step: 2, required: false, width: "half" }),
      q({ id: "num_jugadores", type: "peopleCount", label: "Número de jugadores", step: 2, width: "half" }),
      q({
        id: "nivel",
        type: "select",
        label: "Nivel",
        step: 2,
        required: false,
        options: [
          { value: "iniciacion", label: "Iniciación" },
          { value: "intermedio", label: "Intermedio" },
          { value: "avanzado", label: "Avanzado" },
        ],
      }),
      q({ id: "mensaje", type: "longText", label: "Mensaje", step: 3, required: false }),
    ],
  },
  {
    _id: "form-general",
    slug: "general",
    title: "Contacto general",
    submitLabel: "Enviar",
    introTitle: "¿Qué te trae hasta aquí?",
    introText: undefined,
    successTitle: "¡Gracias!",
    successText: "Hemos recibido tu mensaje. Te contactaremos en menos de 48h.",
    questions: [
      q({
        id: "motivo",
        type: "singleChoice",
        label: "¿Qué te trae hasta aquí?",
        step: 1,
        options: [
          { value: "empresa", label: "Empresa" },
          { value: "evento", label: "Evento" },
          { value: "estancia", label: "Estancia" },
          { value: "comunidad", label: "Comunidad" },
          { value: "pickleball", label: "Pickleball" },
          { value: "visita", label: "Visita" },
          { value: "otro", label: "Otro" },
        ],
      }),
      ...CONTACT_QUESTIONS(2),
      q({ id: "mensaje", type: "longText", label: "Mensaje", step: 2, required: false }),
    ],
  },
];

async function run() {
  console.log(`\nCreando formularios iniciales en el dataset "${dataset}" (solo si no existen ya)...\n`);

  for (const form of forms) {
    const doc = {
      _id: form._id,
      _type: "form",
      title: form.title,
      slug: { _type: "slug", current: form.slug },
      active: true,
      introTitle: form.introTitle,
      introText: form.introText,
      successTitle: form.successTitle,
      successText: form.successText,
      submitLabel: form.submitLabel,
      questions: form.questions,
    };

    await client.createIfNotExists(doc as Record<string, unknown> & { _id: string; _type: string });
    console.log(`  ✔ ${form._id} (/solicitud/${form.slug}) — creado si no existía`);
  }

  console.log("\nListo. Revisa y ajusta los formularios desde /studio → Formularios.\n");
  console.log("Recuerda: para actualizar un formulario ya creado, edítalo en /studio — este script no lo sobrescribe.\n");
}

run().catch((error) => {
  console.error("\n✖ La creación de formularios ha fallado:\n");
  console.error(error);
  process.exit(1);
});
