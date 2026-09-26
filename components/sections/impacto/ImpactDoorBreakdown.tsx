import Link from "next/link";
import type { DoorImpactItem } from "@/types/content";
import Container from "@/components/ui/Container";
import AnimatedIn from "@/components/ui/AnimatedIn";

/**
 * "Cinco puertas, un impacto compartido" — lista editorial, no
 * dashboard de barras ni porcentajes inventados. El nombre de la
 * puerta y el enlace SIEMPRE se muestran (es contenido editorial, no
 * una métrica). Las cifras (contributions/kg/percentage) son el
 * "breakdown cuantitativo" que `impactEnabled` controla: son datos
 * acumulados todavía no verificados, así que solo se muestran cuando
 * `impactEnabled` es true Y el dato concreto está definido — nunca un
 * 0 ni un porcentaje calculado a partir de un total que no existe.
 */
export default function ImpactDoorBreakdown({
  doorImpact,
  impactEnabled,
}: {
  doorImpact: DoorImpactItem[];
  impactEnabled: boolean;
}) {
  if (doorImpact.length === 0) return null;

  return (
    <section className="bg-background py-20 sm:py-28">
      <Container>
        <AnimatedIn className="flex flex-col gap-2 pb-10 sm:pb-14">
          <span className="font-sans text-xs uppercase tracking-[0.25em] text-olive">Cinco puertas, un impacto compartido</span>
          <h2 className="max-w-2xl font-serif text-3xl leading-tight text-text sm:text-4xl">
            Cada forma de vivir Bellaterra Conecta suma a la misma causa.
          </h2>
        </AnimatedIn>

        <div className="flex flex-col" role="list">
          {doorImpact.map((item, index) => {
            const hasFigures =
              impactEnabled &&
              (typeof item.contributions === "number" || typeof item.kg === "number" || typeof item.percentage === "number");

            return (
              <AnimatedIn key={item.door} delay={index * 0.05} className="border-t border-border first:border-t-0">
                <Link
                  href={`/${item.door}`}
                  className="flex flex-col gap-2 py-6 transition-colors hover:text-olive-dark sm:flex-row sm:items-center sm:justify-between sm:py-7"
                >
                  <span className="font-serif text-2xl text-text sm:text-3xl">{item.doorName}</span>
                  {hasFigures ? (
                    <span className="font-sans text-sm text-muted">
                      {[
                        typeof item.contributions === "number" ? `${item.contributions.toLocaleString("es-ES")} contribuciones` : null,
                        typeof item.kg === "number" ? `${item.kg.toLocaleString("es-ES")} kg` : null,
                        typeof item.percentage === "number" ? `${item.percentage}%` : null,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  ) : (
                    <span className="font-sans text-sm text-muted/70">Descubre la puerta →</span>
                  )}
                </Link>
              </AnimatedIn>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
