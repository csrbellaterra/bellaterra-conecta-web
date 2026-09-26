import Link from "next/link";
import type { ImpactSettings } from "@/types/content";
import Container from "@/components/ui/Container";
import AnimatedIn from "@/components/ui/AnimatedIn";

/**
 * CTA final de /impacto — deliberadamente emocional y no comercial:
 * lleva de vuelta a la Home / selector de puertas, no a un formulario
 * de venta. Igual que StoryFinalCta, sin contador ni cifras aquí (eso
 * ya se ha mostrado arriba, en ImpactCounter).
 */
export default function ImpactFinalCta({ impact }: { impact: ImpactSettings }) {
  const ctaUrl = impact.finalCtaUrl || "/#selector";

  return (
    <section className="bg-surface py-20 sm:py-28">
      <Container className="flex flex-col items-center gap-4 text-center">
        <AnimatedIn className="flex flex-col items-center gap-4">
          {impact.finalCtaHeadline ? (
            <h2 className="max-w-xl font-serif text-3xl text-text sm:text-4xl">{impact.finalCtaHeadline}</h2>
          ) : null}
          {impact.finalCtaBody ? <p className="max-w-md font-sans text-base text-muted">{impact.finalCtaBody}</p> : null}
          <Link
            href={ctaUrl}
            className="mt-2 inline-flex items-center gap-2 rounded-pill bg-olive px-7 py-3 font-sans text-sm font-medium tracking-wide text-white transition-colors hover:bg-olive-dark"
          >
            {impact.finalCtaLabel || "DESCUBRE LAS EXPERIENCIAS"} <span aria-hidden>→</span>
          </Link>
        </AnimatedIn>
      </Container>
    </section>
  );
}
