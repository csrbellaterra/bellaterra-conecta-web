import Link from "next/link";
import type { HomePage, ImpactSettings } from "@/types/content";
import Container from "@/components/ui/Container";
import AnimatedIn from "@/components/ui/AnimatedIn";
import CountUp from "@/components/ui/CountUp";
import { HOME_PLASTY_COPY } from "@/lib/homeCopy";

/**
 * Sección PLASTY de la home (V2) — NO es una sexta puerta, es la
 * explicación de PLASTY + enlace a /impacto. Solo muestra un contador
 * si impact.impactEnabled es true y hay un valor real en Sanity —
 * nunca se inventa ni se hardcodea una cifra (ver
 * lib/sanity/seed-data.ts, que fuerza impactEnabled a false por
 * defecto).
 *
 * Texto: homePage.plastyEyebrow/plastyHeadline/plastyBody/
 * plastyCtaLabel/plastyCtaUrl (Sanity), con fallback a
 * homePage.impactSection (heredado) y, en último lugar, al copy
 * aprobado de lib/homeCopy.ts.
 */
export default function PlastySection({ home, impact }: { home: HomePage; impact: ImpactSettings }) {
  const eyebrow = home.plastyEyebrow || HOME_PLASTY_COPY.eyebrow;
  const heading = home.plastyHeadline || home.impactSection?.heading || HOME_PLASTY_COPY.heading;
  const body = home.plastyBody || home.impactSection?.body || HOME_PLASTY_COPY.body;
  const ctaLabel = home.plastyCtaLabel || home.impactSection?.ctaLabel || HOME_PLASTY_COPY.ctaLabel;
  const ctaUrl = home.plastyCtaUrl || home.impactSection?.ctaUrl || HOME_PLASTY_COPY.ctaUrl;

  return (
    <section className="bg-olive-dark py-20 text-white sm:py-28">
      <Container className="flex flex-col items-center gap-6 text-center">
        <AnimatedIn className="flex flex-col items-center gap-4">
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-white/70">{eyebrow}</span>
          <h2 className="font-serif text-3xl sm:text-4xl">{heading}</h2>
          {impact.impactEnabled && typeof impact.impactKg === "number" ? (
            <p className="font-serif text-5xl sm:text-6xl">
              <CountUp value={impact.impactKg} suffix=" kg" />
            </p>
          ) : (
            <p className="max-w-xl font-sans text-base text-white/80">{body}</p>
          )}
        </AnimatedIn>

        <Link
          href={ctaUrl}
          className="mt-2 inline-flex items-center gap-2 rounded-pill border border-white/30 px-6 py-3 font-sans text-sm tracking-wide transition-colors hover:bg-white hover:text-olive-dark"
        >
          {ctaLabel} <span aria-hidden>→</span>
        </Link>
      </Container>
    </section>
  );
}
