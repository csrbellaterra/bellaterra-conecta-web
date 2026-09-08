import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { getAllDoors, getImpactSettings } from "@/lib/content";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/ui/Container";
import AnimatedIn from "@/components/ui/AnimatedIn";
import CountUp from "@/components/ui/CountUp";
import PlastyBadge from "@/components/PlastyBadge";

export const metadata: Metadata = {
  title: "Impacto",
  description: "Cómo cada experiencia en Bellaterra Conecta contribuye a financiar la recuperación de plástico a través de PLASTY.",
};

/**
 * Página de impacto. La cifra total agregada SOLO se muestra si
 * impact.impactEnabled es true en Sanity con un valor real (ver
 * lib/sanity/seed-data.ts e instrucciones en EDITOR_GUIDE.md). Las
 * aportaciones por puerta, en cambio, sí son cifras confirmadas del
 * Documento Fundacional y se muestran siempre.
 */
export default async function ImpactoPage() {
  const { isEnabled: preview } = draftMode();
  const [doors, impact] = await Promise.all([getAllDoors(preview), getImpactSettings(preview)]);
  const sorted = [...doors].sort((a, b) => a.order - b.order);

  return (
    <>
      <Header variant="solid" />
      <main className="pb-24 pt-32 sm:pt-40">
        <Container>
          <AnimatedIn className="mx-auto flex max-w-2xl flex-col gap-6 text-center">
            <h1 className="font-serif text-4xl text-text sm:text-5xl">Nuestro impacto</h1>

            {impact.impactEnabled && typeof impact.impactKg === "number" ? (
              <>
                <p className="font-serif text-6xl text-olive sm:text-7xl">
                  <CountUp value={impact.impactKg} suffix=" kg" />
                </p>
                {impact.impactMethodology ? (
                  <p className="font-sans text-sm text-muted">{impact.impactMethodology}</p>
                ) : null}
                {impact.impactUpdatedAt ? (
                  <p className="font-sans text-xs text-muted/70">
                    Última actualización: {new Date(impact.impactUpdatedAt).toLocaleDateString("es-ES")}
                  </p>
                ) : null}
              </>
            ) : (
              <p className="font-sans text-lg text-muted">
                Cada experiencia en Bellaterra Conecta genera una aportación a PLASTY para la recuperación de
                plástico. Estamos consolidando la metodología de cálculo del impacto total; en cuanto tengamos
                una cifra verificada, la publicaremos aquí.
              </p>
            )}
          </AnimatedIn>

          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
            {sorted
              .filter((door) => door.plastyContribution)
              .map((door, index) => (
                <AnimatedIn key={door.id} delay={index * 0.05}>
                  <div className="flex flex-col gap-2">
                    <span className="font-sans text-xs uppercase tracking-[0.2em] text-muted">{door.name}</span>
                    <PlastyBadge contribution={door.plastyContribution!} />
                  </div>
                </AnimatedIn>
              ))}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
