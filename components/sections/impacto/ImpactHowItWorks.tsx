import type { DoorImpactItem } from "@/types/content";
import Container from "@/components/ui/Container";
import AnimatedIn from "@/components/ui/AnimatedIn";

/**
 * "Cómo funciona PLASTY" — texto de referencia por puerta, editable
 * desde Sanity (impact.doorImpact[].contributionText), nunca un
 * cálculo automático (ver CLAUDE.md). Solo se muestran las puertas con
 * `enabled: true` y `contributionText` definido: Pickleball, sin
 * escuela ni PLASTY de escuela, queda fuera de esta lista hasta que se
 * defina un nuevo modelo, sin necesidad de ningún condicional especial
 * aquí — el propio contenido de Sanity lo controla.
 */
export default function ImpactHowItWorks({ doorImpact }: { doorImpact: DoorImpactItem[] }) {
  const items = doorImpact.filter((item) => item.enabled && item.contributionText);
  if (items.length === 0) return null;

  return (
    <section className="bg-surface py-20 sm:py-28">
      <Container>
        <AnimatedIn className="flex flex-col gap-2 pb-10 sm:pb-14">
          <span className="font-sans text-xs uppercase tracking-[0.25em] text-olive">Cómo funciona PLASTY</span>
          <h2 className="max-w-2xl font-serif text-3xl leading-tight text-text sm:text-4xl">
            El modelo se sigue afinando. Así es como funciona hoy.
          </h2>
        </AnimatedIn>

        <div className="flex flex-col" role="list">
          {items.map((item, index) => (
            <AnimatedIn key={item.door} delay={index * 0.05} className="border-t border-border py-6 first:border-t-0 sm:py-7">
              <p className="font-sans text-xs uppercase tracking-[0.15em] text-olive">{item.doorName}</p>
              <p className="mt-2 max-w-xl font-sans text-base leading-relaxed text-muted sm:text-lg">{item.contributionText}</p>
            </AnimatedIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
