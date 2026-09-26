import type { ImpactSettings } from "@/types/content";
import Container from "@/components/ui/Container";
import AnimatedIn from "@/components/ui/AnimatedIn";
import CountUp from "@/components/ui/CountUp";

/**
 * Bloque principal de contador de /impacto. Regla estricta (ver
 * CLAUDE.md — "Content policy — PLASTY / Impacto"): NO se hardcodean
 * cantidades acumuladas en el componente. Cada cifra (kg totales,
 * número de contribuciones, fecha de actualización, objetivo anual)
 * viene de Sanity (impact.impactKg / totalContributions /
 * impactUpdatedAt / annualTarget) y, si no está definida, se OCULTA —
 * nunca se muestra un 0 que dé la falsa impresión de un dato real.
 *
 * kg totales y número de contribuciones solo se muestran cuando
 * impact.impactEnabled es true, igual que ya exige PlastySection en
 * la Home: impactEnabled es la señal de "ya existe una tabla maestra
 * de impacto verificada", no solo de que el campo tenga un valor.
 */
export default function ImpactCounter({ impact }: { impact: ImpactSettings }) {
  const showKg = impact.impactEnabled && typeof impact.impactKg === "number";
  const showContributions = impact.impactEnabled && typeof impact.totalContributions === "number";
  const showUpdatedAt = Boolean(impact.impactUpdatedAt);
  const showAnnualTarget = impact.annualTargetEnabled && typeof impact.annualTarget === "number";
  const hasAnyFigure = showKg || showContributions;

  const updatedAtLabel = showUpdatedAt
    ? new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric" }).format(new Date(impact.impactUpdatedAt as string))
    : null;

  return (
    <section className="bg-olive-dark py-20 text-white sm:py-28">
      <Container className="flex flex-col items-center gap-8 text-center">
        <AnimatedIn className="flex flex-col items-center gap-8">
          {hasAnyFigure ? (
            <div className="flex flex-wrap items-end justify-center gap-x-14 gap-y-8">
              {showKg ? (
                <div className="flex flex-col items-center gap-2">
                  <p className="font-serif text-5xl sm:text-6xl">
                    <CountUp value={impact.impactKg as number} suffix=" kg" />
                  </p>
                  <span className="font-sans text-xs uppercase tracking-[0.25em] text-white/70">
                    de plástico financiados
                  </span>
                </div>
              ) : null}
              {showContributions ? (
                <div className="flex flex-col items-center gap-2">
                  <p className="font-serif text-5xl sm:text-6xl">
                    <CountUp value={impact.totalContributions as number} />
                  </p>
                  <span className="font-sans text-xs uppercase tracking-[0.25em] text-white/70">contribuciones</span>
                </div>
              ) : null}
            </div>
          ) : (
            <p className="max-w-xl font-sans text-base text-white/80">
              Estamos consolidando la primera tabla de impacto verificada. En cuanto tengamos una cifra confirmada, aparecerá aquí.
            </p>
          )}

          {showAnnualTarget ? (
            <p className="font-sans text-sm text-white/70">
              Objetivo anual de referencia:{" "}
              <span className="text-white">{(impact.annualTarget as number).toLocaleString("es-ES")} kg</span>
            </p>
          ) : null}

          {updatedAtLabel ? (
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-white/50">Última actualización: {updatedAtLabel}</p>
          ) : null}
        </AnimatedIn>
      </Container>
    </section>
  );
}
