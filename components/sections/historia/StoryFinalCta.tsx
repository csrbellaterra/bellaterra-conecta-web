import Link from "next/link";
import type { StoryPage } from "@/types/content";
import Container from "@/components/ui/Container";
import AnimatedIn from "@/components/ui/AnimatedIn";

/**
 * CTA final de /nuestra-historia — deliberadamente simple (sin media,
 * sin PLASTY, sin contador): "no hace falta una sección PLASTY
 * grande... no contador, no kg, no bloque comercial de impacto". Eso
 * lo desarrolla /impacto.
 */
export default function StoryFinalCta({ story }: { story: StoryPage }) {
  const baseUrl = story.finalCtaForm ? `/solicitud/${story.finalCtaForm}` : story.finalCtaUrl || "/solicitud/general";
  // ctaSource identifica este CTA como proveniente de Nuestra Historia — viaja
  // como parámetro de URL y FormRenderer lo adjunta al envío igual que
  // eventId/eventTitle/eventDate (ver components/forms/FormRenderer.tsx).
  const ctaUrl = `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}ctaSource=historia-visita`;

  return (
    <section className="bg-surface py-20 sm:py-28">
      <Container className="flex flex-col items-center gap-4 text-center">
        <AnimatedIn className="flex flex-col items-center gap-4">
          {story.finalCtaHeadline ? (
            <h2 className="max-w-xl font-serif text-3xl text-text sm:text-4xl">{story.finalCtaHeadline}</h2>
          ) : null}
          {story.finalCtaBody ? <p className="max-w-md font-sans text-base text-muted">{story.finalCtaBody}</p> : null}
          <Link
            href={ctaUrl}
            className="mt-2 inline-flex items-center gap-2 rounded-pill bg-olive px-7 py-3 font-sans text-sm font-medium tracking-wide text-white transition-colors hover:bg-olive-dark"
          >
            {story.finalCtaLabel || "VEN A CONOCERNOS"} <span aria-hidden>→</span>
          </Link>
        </AnimatedIn>
      </Container>
    </section>
  );
}
