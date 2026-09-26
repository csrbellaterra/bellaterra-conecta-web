import { BookIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

/**
 * Documento único (singleton) para /nuestra-historia — Fase 4B. NO es
 * un page builder genérico como `page` (ver documents/page.ts): el
 * diseño de esta página está fijado en código (componentes propios en
 * components/sections/historia/*), Sanity solo controla el contenido y
 * la media de cada bloque narrativo fijo. Esto es intencional: "Nuestra
 * Historia" es la página más emocional/editorial del sitio y no debe
 * parecer una puerta más ni un conjunto de bloques intercambiables.
 *
 * `identityItems` reutiliza el objeto `timelineItem` ya existente
 * (label/title/body/media) para los 5 verbos de "Qué somos"
 * (CELEBRAR/TRABAJAR/QUEDARSE/PARTICIPAR/JUGAR) y, opcionalmente, para
 * la timeline 1967/Hoy/Mañana (`timelineItems`, activable con
 * `timelineEnabled` — la sección B7 del prompt es opcional: "si no
 * aporta valor, no implementarla", así que se deja como interruptor).
 */
export default defineType({
  name: "storyPage",
  title: "Nuestra Historia",
  type: "document",
  icon: BookIcon,
  groups: [
    { name: "hero", title: "Hero" },
    { name: "origin", title: "De dónde venimos" },
    { name: "identity", title: "Qué somos" },
    { name: "statement", title: "Frase destacada" },
    { name: "future", title: "Hacia dónde vamos" },
    { name: "timeline", title: "Timeline (opcional)" },
    { name: "finalCta", title: "CTA final" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "heroMedia", title: "Imagen/vídeo del hero", type: "media", validation: (Rule) => Rule.required(), group: "hero" }),
    defineField({
      name: "heroEyebrow",
      title: "Texto superior del hero",
      type: "string",
      initialValue: "NUESTRA HISTORIA",
      group: "hero",
    }),
    defineField({
      name: "heroHeadline",
      title: "Titular del hero",
      type: "text",
      rows: 2,
      initialValue: "Una finca familiar.\nUna nueva forma de conectar.",
      group: "hero",
    }),
    defineField({
      name: "heroDetail",
      title: "Detalle del hero (ej. año)",
      type: "string",
      description: 'Ej. "1967 — Bellaterra". Texto corto, discreto, sin sobrecargar el hero.',
      initialValue: "1967 — Bellaterra",
      group: "hero",
    }),

    defineField({ name: "originTitle", title: "Título", type: "string", initialValue: "De dónde venimos", group: "origin" }),
    defineField({
      name: "originBody",
      title: "Texto",
      type: "text",
      rows: 5,
      initialValue:
        "Bellaterra Conecta nace en una finca familiar construida en 1967. Somos la primera generación que ha decidido abrirla a nuevas experiencias y darle un propósito adaptado al presente.",
      group: "origin",
    }),
    defineField({ name: "originMedia", title: "Fotografía histórica/familiar/de la finca", type: "media", group: "origin" }),

    defineField({ name: "identityTitle", title: "Título (opcional)", type: "string", group: "identity" }),
    defineField({
      name: "identityBody",
      title: "Texto",
      type: "text",
      rows: 4,
      initialValue:
        "En un mismo lugar conviven deporte, celebraciones, empresa, alojamiento y nuevas conexiones profesionales. Cada experiencia tiene su propia identidad, pero todas forman parte de Bellaterra Conecta.",
      group: "identity",
    }),
    defineField({
      name: "identityItems",
      title: "Los cinco verbos (CELEBRAR, TRABAJAR, QUEDARSE, PARTICIPAR, JUGAR)",
      description:
        "Lista editorial, no cards: se muestra como identidad de marca con fotografía/vídeo cambiante, no como navegación funcional. Usa el título del item como el verbo.",
      type: "array",
      of: [{ type: "timelineItem" }],
      group: "identity",
    }),

    defineField({
      name: "statement",
      title: "Frase destacada",
      type: "text",
      rows: 3,
      description: "Uno de los momentos visuales más importantes de la web — gran tipografía editorial, sin sobrecargar.",
      initialValue: "NO ES LA FINCA.\n\nES TODO LO QUE\nOCURRE DENTRO\nDE ELLA.",
      group: "statement",
    }),
    defineField({ name: "statementMedia", title: "Media de fondo (opcional)", type: "media", description: "Opcional: fondo crema limpio, fotografía o media muy sutil.", group: "statement" }),

    defineField({ name: "futureTitle", title: "Título", type: "string", initialValue: "Hacia dónde vamos", group: "future" }),
    defineField({
      name: "futureBody",
      title: "Texto",
      type: "text",
      rows: 5,
      initialValue:
        "Queremos que las personas lleguen por una experiencia, descubran otras posibilidades y encuentren motivos para volver. No buscamos crecer únicamente en actividades, sino construir una comunidad alrededor de experiencias que conectan y generan impacto positivo.",
      group: "future",
    }),
    defineField({ name: "futureMedia", title: "Fotografía", type: "media", group: "future" }),

    defineField({
      name: "timelineEnabled",
      title: "Mostrar timeline (opcional)",
      type: "boolean",
      description: "Pequeña timeline editorial (ej. 1967 / Hoy / Mañana). Actívala solo si aporta valor narrativo.",
      initialValue: false,
      group: "timeline",
    }),
    defineField({
      name: "timelineItems",
      title: "Momentos de la timeline",
      description: "No inventar fechas históricas adicionales — usar solo momentos reales o genéricos (Hoy, Mañana).",
      type: "array",
      of: [{ type: "timelineItem" }],
      hidden: ({ document }) => !document?.timelineEnabled,
      group: "timeline",
    }),

    defineField({ name: "finalCtaHeadline", title: "Título del CTA final", type: "string", initialValue: "¿Quieres conocer Bellaterra Conecta?", group: "finalCta" }),
    defineField({
      name: "finalCtaBody",
      title: "Texto del CTA final",
      type: "text",
      rows: 2,
      initialValue: "Ven a descubrir el espacio y cuéntanos qué te gustaría hacer.",
      group: "finalCta",
    }),
    defineField({ name: "finalCtaLabel", title: "Texto del botón", type: "string", initialValue: "VEN A CONOCERNOS", group: "finalCta" }),
    defineField({
      name: "finalCtaForm",
      title: "Formulario del CTA final",
      type: "reference",
      to: [{ type: "form" }],
      description: "Si se deja vacío, se usa finalCtaUrl o /solicitud/general por defecto.",
      group: "finalCta",
    }),
    defineField({
      name: "finalCtaUrl",
      title: "URL del CTA final (alternativa al formulario)",
      type: "string",
      description: 'Se usa solo si no hay formulario seleccionado arriba. Por defecto "/solicitud/general".',
      group: "finalCta",
    }),

    defineField({ name: "seo", title: "SEO", type: "seoFields", group: "seo" }),
  ],
  preview: {
    prepare() {
      return { title: "Nuestra Historia" };
    },
  },
});
