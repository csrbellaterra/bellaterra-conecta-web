import { defineField, defineType } from "sanity";

/**
 * Documento único (singleton) que controla el impacto de PLASTY.
 *
 * Campos LEGACY (grupo "legacy", sin tocar desde Fase 2): impactEnabled/
 * impactKg/impactUpdatedAt siguen alimentando el teaser de PLASTY de la
 * Home (ver components/sections/PlastySection.tsx) — Fase 5 los
 * REUTILIZA para "kilogramos totales" y "última actualización" de
 * /impacto en vez de duplicarlos (totalKg/lastUpdated NO existen como
 * campos separados a propósito). impactMethodology/impactMethodologyUrl
 * son del modelo antiguo de "Transparencia": Fase 5 los deja intactos
 * pero NO los renderiza en ningún sitio nuevo (ver CLAUDE.md → Content
 * policy: no implementar Transparencia pública todavía).
 *
 * Campos NUEVOS (Fase 5, aditivos): hero*, totalContributions,
 * annualTarget/annualTargetEnabled, doorImpact[] (aportación real por
 * puerta — distinto de door.plastyContributionText, que es el texto de
 * referencia mostrado en la propia página de cada puerta),
 * hallOfFameEnabled, finalCta*.
 */
export default defineType({
  name: "impact",
  title: "Impacto (PLASTY)",
  type: "document",
  groups: [
    { name: "hero", title: "Hero" },
    { name: "counter", title: "Contador principal" },
    { name: "doors", title: "Cinco puertas" },
    { name: "community", title: "Comunidad que contribuye" },
    { name: "finalCta", title: "CTA final" },
    { name: "legacy", title: "Cifra global (heredado)", default: true },
  ],
  fields: [
    defineField({
      name: "impactEnabled",
      title: "Publicar cifra de impacto",
      type: "boolean",
      description:
        "Actívalo SOLO cuando impactKg sea un dato real y verificado. Mientras esté desactivado, el sitio (Home y /impacto) muestra un mensaje genérico sin cifras. Este interruptor controla también el contador principal de /impacto.",
      initialValue: false,
      group: "legacy",
    }),
    defineField({
      name: "impactKg",
      title: "Kg de plástico recuperado (total)",
      type: "number",
      description: "Se usa como \"kilogramos totales acumulados\" tanto en la Home como en /impacto.",
      hidden: ({ document }) => !document?.impactEnabled,
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const doc = context.document as { impactEnabled?: boolean } | undefined;
          if (doc?.impactEnabled && (value === undefined || value === null)) {
            return "Obligatorio si la cifra de impacto está activada.";
          }
          return true;
        }),
      group: "legacy",
    }),
    defineField({
      name: "impactUpdatedAt",
      title: "Fecha de la última actualización de la cifra",
      type: "date",
      hidden: ({ document }) => !document?.impactEnabled,
      group: "legacy",
    }),
    defineField({
      name: "impactMethodology",
      title: "Nota de metodología (no publicada todavía)",
      type: "text",
      rows: 3,
      description:
        "Cómo se calcula la cifra. Guardado para cuando exista una sección pública de Transparencia — por ahora no se renderiza en ninguna página.",
      hidden: ({ document }) => !document?.impactEnabled,
      group: "legacy",
    }),
    defineField({
      name: "impactMethodologyUrl",
      title: "Enlace a la metodología completa (no publicado todavía)",
      type: "url",
      hidden: ({ document }) => !document?.impactEnabled,
      group: "legacy",
    }),

    defineField({ name: "heroEyebrow", title: "Texto superior del hero", type: "string", initialValue: "NUESTRO IMPACTO", group: "hero" }),
    defineField({
      name: "heroHeadline",
      title: "Titular del hero",
      type: "text",
      rows: 2,
      initialValue: "Lo que ocurre aquí\ntambién deja huella fuera.",
      group: "hero",
    }),
    defineField({
      name: "heroBody",
      title: "Texto del hero",
      type: "text",
      rows: 3,
      initialValue:
        "PLASTY es la herramienta que transforma cada experiencia de Bellaterra Conecta en una contribución para financiar la recuperación y el reciclaje del plástico.",
      group: "hero",
    }),
    defineField({ name: "heroMedia", title: "Imagen/vídeo del hero", type: "media", group: "hero" }),

    defineField({
      name: "totalContributions",
      title: "Número total de contribuciones",
      type: "number",
      description: "Ej. número de experiencias/reservas vinculadas a PLASTY hasta la fecha. Si se deja vacío, no se muestra ese dato (nunca 0 por defecto).",
      hidden: ({ document }) => !document?.impactEnabled,
      group: "counter",
    }),
    defineField({
      name: "annualTargetEnabled",
      title: "Mostrar objetivo anual",
      type: "boolean",
      initialValue: false,
      group: "counter",
    }),
    defineField({
      name: "annualTarget",
      title: "Objetivo anual (kg)",
      type: "number",
      hidden: ({ document }) => !document?.annualTargetEnabled,
      group: "counter",
    }),

    defineField({
      name: "doorImpact",
      title: "Aportación por puerta",
      description:
        "Un item por puerta (Empresas, Eventos, Estancias, Comunidad, Pickleball). contributionText es el texto de referencia mostrado en \"Cómo funciona PLASTY\" (ej. \"70 kg por evento reservado\") — independiente del texto de la propia página de la puerta. Si enabled es false, esa puerta no muestra cifra (ej. Pickleball, sin modelo definido todavía).",
      type: "array",
      of: [
        {
          type: "object",
          name: "doorImpactItem",
          fields: [
            defineField({ name: "door", title: "Puerta", type: "reference", to: [{ type: "door" }], validation: (Rule) => Rule.required() }),
            defineField({ name: "enabled", title: "Mostrar cifra de esta puerta", type: "boolean", initialValue: true }),
            defineField({ name: "contributionText", title: "Texto de referencia (ej. \"70 kg por evento reservado\")", type: "string" }),
            defineField({ name: "contributions", title: "Número de contribuciones (opcional)", type: "number" }),
            defineField({ name: "kg", title: "Kg acumulados (opcional)", type: "number" }),
            defineField({ name: "percentage", title: "Porcentaje sobre el total (opcional)", type: "number", description: "Solo si es un dato real verificado — nunca calcular ni inventar." }),
          ],
          preview: {
            select: { title: "door.name", subtitle: "contributionText", enabled: "enabled" },
            prepare({ title, subtitle, enabled }) {
              return { title: title || "Puerta", subtitle: enabled === false ? `${subtitle || ""} (oculto)` : subtitle };
            },
          },
        },
      ],
      group: "doors",
    }),

    defineField({
      name: "hallOfFameEnabled",
      title: "Mostrar \"Comunidad que contribuye\"",
      description:
        "Nombre provisional interno: Hall of Fame. Aunque esté activado, la sección solo se muestra si hay al menos un impactContributor con publicationConsent = true.",
      type: "boolean",
      initialValue: false,
      group: "community",
    }),

    defineField({ name: "finalCtaHeadline", title: "Título del CTA final", type: "string", initialValue: "Todo empieza con una experiencia.", group: "finalCta" }),
    defineField({
      name: "finalCtaBody",
      title: "Texto del CTA final",
      type: "text",
      rows: 2,
      initialValue: "Descubre las diferentes formas de vivir Bellaterra Conecta.",
      group: "finalCta",
    }),
    defineField({ name: "finalCtaLabel", title: "Texto del botón", type: "string", initialValue: "DESCUBRE LAS EXPERIENCIAS", group: "finalCta" }),
    defineField({ name: "finalCtaUrl", title: "Destino del botón", type: "string", initialValue: "/#selector", group: "finalCta" }),
  ],
  preview: {
    select: { enabled: "impactEnabled", kg: "impactKg" },
    prepare({ enabled, kg }) {
      return { title: "Impacto (PLASTY)", subtitle: enabled ? `Publicado: ${kg ?? "?"} kg` : "Sin publicar (genérico)" };
    },
  },
});
