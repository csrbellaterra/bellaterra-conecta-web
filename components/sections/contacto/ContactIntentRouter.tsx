import Link from "next/link";
import type { ContactPage } from "@/types/content";
import Container from "@/components/ui/Container";
import AnimatedIn from "@/components/ui/AnimatedIn";
import { CONTACT_HERO_HEADLINE, CONTACT_INTENT_OPTIONS } from "@/lib/contactCopy";

/**
 * Router de intención de /contacto (Fase 5) — deliberadamente NO es un
 * formulario tradicional de nombre/email/mensaje. Opciones grandes,
 * cada una llevando directamente al formulario específico de
 * /solicitud/[slug]. Esto SÍ es un elemento funcional (como el
 * selector de 5 puertas), así que las filas grandes con número/título/
 * descripción/flecha son la excepción permitida a la regla "no cards"
 * (ver CLAUDE.md).
 *
 * Contenido: contact.heroEyebrow/heroHeadline/heroBody/intents[]
 * (Sanity, documento `contactPage`) → lib/contactCopy.ts (fallback).
 * La prioridad se aplica documento a documento en `intents` (si Sanity
 * ya tiene alguna opción cargada, se usan solo esas — no se mezclan
 * las dos listas) para que desactivar/reordenar desde Sanity funcione
 * de forma predecible. Solo se muestran las opciones con
 * `enabled !== false`, ordenadas por `order`.
 *
 * Mobile: cada fila es directamente táctil y grande, sin acordeones
 * innecesarios — un solo toque lleva al formulario correspondiente.
 */
export default function ContactIntentRouter({ contact, legacyTitle }: { contact: ContactPage; legacyTitle?: string }) {
  const eyebrow = contact.heroEyebrow;
  const headline = contact.heroHeadline || legacyTitle || CONTACT_HERO_HEADLINE;
  const body = contact.heroBody;

  const intents = (contact.intents && contact.intents.length > 0 ? contact.intents : CONTACT_INTENT_OPTIONS)
    .filter((intent) => intent.enabled !== false)
    .slice()
    .sort((a, b) => a.order - b.order);

  return (
    <section className="bg-background pb-8 pt-28 sm:pb-10 sm:pt-32">
      <Container>
        <AnimatedIn className="flex flex-col gap-3 pb-8 sm:pb-10">
          {eyebrow ? <span className="font-sans text-xs uppercase tracking-[0.25em] text-olive">{eyebrow}</span> : null}
          <h1 className="max-w-2xl font-serif text-3xl leading-tight text-text sm:text-4xl lg:text-5xl">{headline}</h1>
          {body ? <p className="max-w-xl font-sans text-base text-muted">{body}</p> : null}
        </AnimatedIn>

        <div className="flex flex-col" role="list">
          {intents.map((intent, index) => (
            <AnimatedIn key={intent.id} delay={index * 0.04} className="border-t border-border first:border-t-0">
              <Link
                href={intent.url}
                className="group flex items-center gap-5 py-6 transition-colors hover:text-olive-dark sm:gap-8 sm:py-8"
              >
                <span className="w-10 shrink-0 font-sans text-sm tracking-[0.1em] text-olive sm:w-12 sm:text-base">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="font-serif text-2xl text-text sm:text-3xl">{intent.title}</span>
                  {intent.description ? (
                    <span className="max-w-lg font-sans text-sm text-muted sm:text-base">{intent.description}</span>
                  ) : null}
                </span>
                <span
                  aria-hidden
                  className="shrink-0 font-sans text-xl text-muted transition-transform group-hover:translate-x-1 group-hover:text-olive-dark sm:text-2xl"
                >
                  →
                </span>
              </Link>
            </AnimatedIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
