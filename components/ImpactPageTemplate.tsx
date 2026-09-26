import type { ImpactContributor, ImpactSettings } from "@/types/content";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImpactHero from "@/components/sections/impacto/ImpactHero";
import ImpactCounter from "@/components/sections/impacto/ImpactCounter";
import ImpactDoorBreakdown from "@/components/sections/impacto/ImpactDoorBreakdown";
import ImpactHowItWorks from "@/components/sections/impacto/ImpactHowItWorks";
import ImpactCommunity from "@/components/sections/impacto/ImpactCommunity";
import ImpactFinalCta from "@/components/sections/impacto/ImpactFinalCta";

/**
 * Plantilla de /impacto (Fase 5). Hero → contador principal → "Cinco
 * puertas, un impacto compartido" → "Cómo funciona PLASTY" →
 * "Comunidad que contribuye" (Hall of Fame, solo si hay contributors
 * publicados) → CTA final emocional. Deliberadamente NO incluye una
 * sección pública de "Transparencia" (ver CLAUDE.md).
 */
export default function ImpactPageTemplate({
  impact,
  contributors,
}: {
  impact: ImpactSettings;
  contributors: ImpactContributor[];
}) {
  const doorImpact = impact.doorImpact ?? [];

  return (
    <>
      <Header variant="transparent" />
      <main>
        <ImpactHero impact={impact} />
        <ImpactCounter impact={impact} />
        <ImpactDoorBreakdown doorImpact={doorImpact} />
        <ImpactHowItWorks doorImpact={doorImpact} />
        <ImpactCommunity enabled={Boolean(impact.hallOfFameEnabled)} contributors={contributors} />
        <ImpactFinalCta impact={impact} />
      </main>
      <Footer />
    </>
  );
}
