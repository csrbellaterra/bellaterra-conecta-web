import Link from "next/link";
import type { Door } from "@/types/content";
import Container from "@/components/ui/Container";
import AnimatedIn from "@/components/ui/AnimatedIn";
import { DOOR_PAGE_COPY } from "@/lib/doorCopy";

/**
 * Bloque PLASTY de la página de puerta (V2) — elegante y secundario,
 * NO la pequeña tarjeta blanca actual (ver components/PlastyBadge.tsx,
 * que sigue usándose sin cambios en Estancias/Comunidad/Pickleball).
 *
 * Texto: door.plastyContributionText (Sanity) con fallback al copy
 * aprobado por puerta en lib/doorCopy.ts. Respeta
 * plastyContributionEnabled (desactivado explícitamente para
 * Pickleball, no aplica aquí porque este bloque solo se monta para
 * Empresas/Eventos, donde el modelo PLASTY ya está confirmado).
 */
export default function DoorPlastyBlock({ door }: { door: Door }) {
  if (door.plastyContributionEnabled === false) return null;

  const copy = DOOR_PAGE_COPY[door.id as "empresas" | "eventos"];
  const body = door.plastyContributionText || copy.plasty.body;

  return (
    <section className="bg-olive-dark py-16 text-white sm:py-20">
      <Container className="flex flex-col items-center gap-5 text-center">
        <AnimatedIn className="flex flex-col items-center gap-4">
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-white/70">PLASTY</span>
          <h2 className="max-w-xl font-serif text-2xl sm:text-3xl">{copy.plasty.heading}</h2>
          <p className="max-w-lg font-sans text-base text-white/80">{body}</p>
        </AnimatedIn>
        <Link
          href="/impacto"
          className="mt-1 inline-flex items-center gap-2 rounded-pill border border-white/30 px-6 py-3 font-sans text-sm tracking-wide transition-colors hover:bg-white hover:text-olive-dark"
        >
          {copy.plasty.ctaLabel} <span aria-hidden>→</span>
        </Link>
      </Container>
    </section>
  );
}
