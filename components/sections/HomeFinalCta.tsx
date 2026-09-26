import Link from "next/link";
import type { HomePage } from "@/types/content";
import Container from "@/components/ui/Container";
import AnimatedIn from "@/components/ui/AnimatedIn";
import { HOME_FINAL_CTA_COPY } from "@/lib/homeCopy";

/**
 * CTA final de la home. Texto: homePage.finalCtaEyebrow/Headline/Body/
 * Label (Sanity), con fallback a homePage.footerCta (heredado) y
 * luego al copy aprobado. Destino: finalCtaForm (si hay formulario
 * seleccionado, tiene prioridad) > finalCtaUrl > /solicitud/general —
 * NUNCA /contacto, según el hotfix pedido: los CTAs comerciales dejan
 * de apuntar al flujo de /contacto?puerta=...
 */
export default function HomeFinalCta({ home }: { home: HomePage }) {
  const eyebrow = home.finalCtaEyebrow;
  const heading = home.finalCtaHeadline || home.footerCta?.heading || HOME_FINAL_CTA_COPY.heading;
  const body = home.finalCtaBody || HOME_FINAL_CTA_COPY.body;
  const ctaLabel = home.finalCtaLabel || home.footerCta?.ctaLabel || HOME_FINAL_CTA_COPY.ctaLabel;
  const ctaUrl = home.finalCtaForm
    ? `/solicitud/${home.finalCtaForm}`
    : home.finalCtaUrl || HOME_FINAL_CTA_COPY.ctaUrl;

  return (
    <section className="bg-surface py-24 sm:py-32 lg:py-40">
      <Container className="flex flex-col items-center gap-6 text-center">
        <AnimatedIn className="flex flex-col items-center gap-6">
          {eyebrow ? (
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-olive">{eyebrow}</span>
          ) : null}
          <h2 className="max-w-2xl font-serif text-4xl leading-tight text-text sm:text-5xl lg:text-[3.25rem]">{heading}</h2>
          <p className="max-w-md font-sans text-base leading-relaxed text-muted">{body}</p>
          <Link href={ctaUrl} className="btn-primary mt-2">
            {ctaLabel} <span aria-hidden>→</span>
          </Link>
        </AnimatedIn>
      </Container>
    </section>
  );
}
