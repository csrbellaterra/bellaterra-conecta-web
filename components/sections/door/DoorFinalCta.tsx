import Link from "next/link";
import type { Door } from "@/types/content";
import Container from "@/components/ui/Container";
import Media from "@/components/ui/Media";
import AnimatedIn from "@/components/ui/AnimatedIn";
import { DOOR_PAGE_COPY } from "@/lib/doorCopy";

/**
 * CTA final de la página de puerta (V2) — bloque grande con media,
 * distinto del CTA de texto simple de la plantilla V1. Texto:
 * door.finalCtaHeadline/Body/Label (Sanity) con fallback a
 * lib/doorCopy.ts. Destino: finalCtaForm (prioridad) > primaryForm >
 * slug de la puerta — nunca /contacto.
 */
export default function DoorFinalCta({ door }: { door: Door }) {
  const copy = DOOR_PAGE_COPY[door.id as "empresas" | "eventos"];
  const headline = door.finalCtaHeadline || copy.finalCta.headline;
  const body = door.finalCtaBody || copy.finalCta.body;
  const ctaLabel = door.finalCtaLabel || copy.finalCta.ctaLabel;
  const ctaUrl = `/solicitud/${door.finalCtaForm || door.primaryForm || door.slug}`;

  return (
    <section className="relative flex min-h-[420px] w-full items-center overflow-hidden bg-ink py-20 sm:py-28">
      <Media media={door.heroMedia} alt={headline} sizes="100vw" className="brightness-[0.6]" />
      <div className="absolute inset-0 bg-ink/35" />
      <Container className="relative z-10 flex flex-col items-center gap-4 text-center">
        <AnimatedIn className="flex flex-col items-center gap-4">
          <h2 className="max-w-xl font-serif text-3xl text-white sm:text-4xl">{headline}</h2>
          <p className="max-w-md font-sans text-base text-white/85">{body}</p>
          <Link
            href={ctaUrl}
            className="mt-2 inline-flex items-center gap-2 rounded-pill bg-white px-7 py-3 font-sans text-sm font-medium tracking-wide text-ink transition-colors hover:bg-olive hover:text-white"
          >
            {ctaLabel} <span aria-hidden>→</span>
          </Link>
        </AnimatedIn>
      </Container>
    </section>
  );
}
