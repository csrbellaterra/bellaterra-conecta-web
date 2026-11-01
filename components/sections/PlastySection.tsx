import Link from "next/link";
import type { HomePage, ImpactSettings } from "@/types/content";
import Container from "@/components/ui/Container";
import AnimatedIn from "@/components/ui/AnimatedIn";
import CountUp from "@/components/ui/CountUp";
import { HOME_PLASTY_COPY } from "@/lib/homeCopy";

/**
 * Sección PLASTY de la home (V2) — NO es una sexta puerta, es la
 * explicación de PLASTY + enlace a /impacto. Nunca se inventa ni se
 * hardcodea una cifra (ver lib/sanity/seed-data.ts).
 *
 * El contador de kg solo aparece si la cifra está documentada como
 * verificada: impactEnabled + impactKg + fecha de actualización
 * (impactUpdatedAt) + nota de metodología (impactMethodology). Sin
 * fecha ni metodología (caso del dato heredado de 350 kg, 31/10/2026)
 * se muestra solo el texto PLASTY y el enlace a Impacto.
 *
 * Texto: homePage.plastyEyebrow/plastyHeadline/plastyBody/
 * plastyCtaLabel/plastyCtaUrl (Sanity), con fallback a
 * homePage.impactSection (heredado) y, en último lugar, al copy
 * aprobado de lib/homeCopy.ts.
 */
export default function PlastySection({ home, impact }: { home: HomePage; impact: ImpactSettings }) {
  const showKg =
    impact.impactEnabled &&
    typeof impact.impactKg === "number" &&
    !!impact.impactUpdatedAt &&
    !!impact.impactMethodology?.trim();
  const eyebrow = home.plastyEyebrow || HOME_PLASTY_COPY.eyebrow;
  const heading = home.plastyHeadline || home.impactSection?.heading || HOME_PLASTY_COPY.heading;
  const body = home.plastyBody || home.impactSection?.body || HOME_PLASTY_COPY.body;
  const ctaLabel = home.plastyCtaLabel || home.impactSection?.ctaLabel || HOME_PLASTY_COPY.ctaLabel;
  const ctaUrl = home.plastyCtaUrl || home.impactSection?.ctaUrl || HOME_PLASTY_COPY.ctaUrl;

  return (
    <section className="bg-olive-dark py-16 text-white sm:py-24 lg:py-28">
      <Container className="flex flex-col items-center gap-7 text-center">
        <AnimatedIn className="flex flex-col items-center gap-4">
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-white/70">{eyebrow}</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.5rem]">{heading}</h2>
          {showKg ? (
            <p className="font-serif text-5xl sm:text-6xl">
              <CountUp value={impact.impactKg as number} suffix=" kg" />
            </p>
          ) : (
            <p className="max-w-xl font-sans text-base leading-relaxed text-white/80">{body}</p>
          )}
        </AnimatedIn>

        <Link href={ctaUrl} className="btn-secondary mt-1">
          {ctaLabel} <span aria-hidden>→</span>
        </Link>
      </Container>
    </section>
  );
}
