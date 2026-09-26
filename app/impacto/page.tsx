import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { getImpactContributors, getImpactSettings } from "@/lib/content";
import ImpactPageTemplate from "@/components/ImpactPageTemplate";

export const metadata: Metadata = {
  title: "Impacto — Bellaterra Conecta",
  description:
    "Cómo cada experiencia en Bellaterra Conecta contribuye, a través de PLASTY, a la financiación de la recuperación de plástico.",
};

export default async function ImpactoPage() {
  const { isEnabled: preview } = draftMode();
  const [impact, contributors] = await Promise.all([getImpactSettings(preview), getImpactContributors(preview)]);
  return <ImpactPageTemplate impact={impact} contributors={contributors} />;
}
