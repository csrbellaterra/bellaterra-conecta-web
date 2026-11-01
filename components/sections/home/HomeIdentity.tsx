import AnimatedIn from "@/components/ui/AnimatedIn";

/**
 * Cierre de identidad de la Home V2: una sola frase editorial entre los
 * portales y PLASTY. Texto: homePage.connectionEyebrow/connectionHeadline
 * (Sanity), con fallback V2 (ver lib/homeCopy.ts → v2Copy).
 */
export default function HomeIdentity({ eyebrow, headline }: { eyebrow?: string; headline: string }) {
  return (
    <section className="bg-surface py-20 sm:py-28">
      <AnimatedIn className="mx-auto flex w-full max-w-content flex-col items-center gap-5 px-5 text-center sm:px-8 lg:px-12">
        <span className="font-sans text-xs uppercase tracking-[0.3em] text-olive">{eyebrow || "Bellaterra Conecta"}</span>
        <p className="max-w-3xl whitespace-pre-line font-serif text-3xl leading-tight text-text sm:text-4xl lg:text-[2.75rem]">{headline}</p>
      </AnimatedIn>
    </section>
  );
}
