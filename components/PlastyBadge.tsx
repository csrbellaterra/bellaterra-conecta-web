import type { PlastyContribution } from "@/types/content";

/**
 * Tarjeta con la aportación PLASTY real de una puerta concreta
 * (importe + kg, tal y como figura en el Documento Fundacional). No
 * confundir con la sección de impacto global de /impacto: aquí es
 * siempre un dato por-puerta y ya confirmado, nunca la cifra total
 * agregada.
 */
export default function PlastyBadge({ contribution }: { contribution: PlastyContribution }) {
  return (
    <div className="flex flex-col gap-3 rounded-card border border-border bg-surface p-6 sm:p-7">
      <span className="font-sans text-xs uppercase tracking-[0.2em] text-olive">Aportación PLASTY</span>
      <p className="font-serif text-3xl text-text">
        {contribution.amountEur}€ <span className="text-lg text-muted">/ {contribution.kg}kg</span>
      </p>
      <p className="font-sans text-sm text-muted">{contribution.label}</p>
      {contribution.note ? <p className="font-sans text-xs text-muted/80">{contribution.note}</p> : null}
    </div>
  );
}
