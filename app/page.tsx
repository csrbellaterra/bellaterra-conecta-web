import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { getAllDoors, getHomePage, getImpactSettings } from "@/lib/content";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/sections/HeroSection";
import DoorSelectorSection from "@/components/sections/DoorSelectorSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import ImpactSection from "@/components/sections/ImpactSection";
import CtaSection from "@/components/sections/CtaSection";
import Container from "@/components/ui/Container";
import Media from "@/components/ui/Media";
import AnimatedIn from "@/components/ui/AnimatedIn";
import type { ExperienceBlock } from "@/types/content";

export async function generateMetadata(): Promise<Metadata> {
  const { isEnabled: preview } = draftMode();
  const home = await getHomePage(preview);
  return {
    title: home.seo.title,
    description: home.seo.description,
  };
}

/**
 * Home page: sigue el orden exacto de la maqueta aprobada — hero →
 * selector de 5 puertas → 5 secciones alternadas (una por puerta,
 * en el mismo orden 01–05) → sección de conexión → sección de
 * impacto (NO es una sexta puerta) → CTA final → footer.
 */
export default async function HomePage() {
  const { isEnabled: preview } = draftMode();
  const [home, doors, impact] = await Promise.all([
    getHomePage(preview),
    getAllDoors(preview),
    getImpactSettings(preview),
  ]);

  const sortedDoors = [...doors].sort((a, b) => a.order - b.order);

  return (
    <>
      <Header variant="transparent" />
      <main>
        <HeroSection block={home.hero} priority />

        <DoorSelectorSection
          block={{ _type: "doorSelectorSection", heading: home.selectorHeading, subheading: home.selectorSubheading }}
          doors={sortedDoors}
        />

        {sortedDoors.map((door, index) => {
          const experienceBlock: ExperienceBlock = {
            _type: "experienceSection",
            doorId: door.id,
            eyebrow: door.eyebrow,
            headline: door.headline,
            body: door.introduction,
            ctaLabel: `Descubre ${door.name}`,
            ctaUrl: `/${door.slug}`,
            media: door.heroMedia,
            imageSide: index % 2 === 0 ? "left" : "right",
          };
          return <ExperienceSection key={door.id} block={experienceBlock} />;
        })}

        <section className="bg-surface py-20 sm:py-28">
          <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <AnimatedIn className="relative aspect-[4/3] w-full overflow-hidden rounded-card lg:order-2">
              <Media media={home.connectionSection.media} alt="Vista aérea de la finca" />
            </AnimatedIn>
            <AnimatedIn className="lg:order-1" delay={0.1}>
              <h2 className="whitespace-pre-line font-serif text-3xl leading-tight text-text sm:text-4xl">
                {home.connectionSection.heading}
              </h2>
            </AnimatedIn>
          </Container>
        </section>

        <ImpactSection block={home.impactSection} impact={impact} />

        {home.footerCta ? <CtaSection block={home.footerCta} /> : null}
      </main>
      <Footer />
    </>
  );
}
