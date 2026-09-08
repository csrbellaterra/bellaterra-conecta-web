import Link from "next/link";
import type { ImpactBlock, ImpactSettings } from "@/types/content";
import Container from "@/components/ui/Container";
import AnimatedIn from "@/components/ui/AnimatedIn";
import CountUp from "@/components/ui/CountUp";

/**
 * Sección de impacto de la home. IMPORTANTE: no es una sexta puerta,
 * es un enlace a /impacto. Solo muestra una cifra si
 * impact.impactEnabled es true en Sanity y con un valor real — la
 * maqueta de diseño incluye "12.480 kg" como marcador de ejemplo que
 * nunca debe publicarse como dato real (ver lib/sanity/seed-data.ts).
 */
export default function ImpactSection({ block, impact }: { block: ImpactBlock; impact: ImpactSettings }) {
  return (
    <section className="bg-olive-dark py-20 text-white sm:py-28">
      <Container className="flex flex-col items-center gap-6 text-center">
        <AnimatedIn className="flex flex-col items-center gap-4">
          <h2 className="font-serif text-3xl sm:text-4xl">{block.heading}</h2>
          {impact.impactEnabled && typeof impact.impactKg === "number" ? (
            <p className="font-serif text-5xl sm:text-6xl">
              <CountUp value={impact.impactKg} suffix=" kg" />
            </p>
          ) : (
            block.body && <p className="max-w-xl font-sans text-base text-white/80">{block.body}</p>
          )}
        </AnimatedIn>

        {block.ctaLabel && block.ctaUrl ? (
          <Link
            href={block.ctaUrl}
            className="mt-2 inline-flex items-center gap-2 rounded-pill border border-white/30 px-6 py-3 font-sans text-sm tracking-wide transition-colors hover:bg-white hover:text-olive-dark"
          >
            {block.ctaLabel} <span aria-hidden>→</span>
          </Link>
        ) : null}
      </Container>
    </section>
  );
}
