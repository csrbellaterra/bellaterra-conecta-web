import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { getAllDoors, getHomePage, getImpactSettings } from "@/lib/content";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/sections/HeroSection";
import DoorSelectorSection from "@/components/sections/DoorSelectorSection";
import HomeExperienceSection from "@/components/sections/HomeExperienceSection";
import PlastySection from "@/components/sections/PlastySection";
import HomeFinalCta from "@/components/sections/HomeFinalCta";
import Container from "@/components/ui/Container";
import Media from "@/components/ui/Media";
import AnimatedIn from "@/components/ui/AnimatedIn";
import { HOME_CONNECTION_COPY } from "@/lib/homeCopy";

export async function generateMetadata(): Promise<Metadata> {
  const { isEnabled: preview } = draftMode();
  const home = await getHomePage(preview);
  return {
    title: home.seo.title,
    description: home.seo.description,
  };
}

/**
 * Home page (V2): hero → selector de 5 puertas (filas accionables) →
 * 5 secciones editoriales alternadas (una por puerta, 01–05) →
 * sección de conexión → sección PLASTY (NO es una sexta puerta) →
 * CTA final → footer.
 *
 * El copy editorial de la Home (selector, las 5 puertas, conexión,
 * PLASTY, CTA final) se lee de Sanity (homePage.*, door.home*) — ver
 * sanity/schemaTypes/documents/homePage.ts y door.ts. lib/homeCopy.ts
 * solo se usa como FALLBACK mientras esos campos estén vacíos en
 * documentos ya publicados; en cuanto se rellenan desde el Studio,
 * ese valor prevalece siempre. Toda la media (home.hero.media,
 * home.connectionSection.media, door.heroMedia/homeMedia) es 100%
 * editable desde Sanity.
 */
export default async function HomePage() {
  const { isEnabled: preview } = draftMode();
  const [home, doors, impact] = await Promise.all([
    getHomePage(preview),
    getAllDoors(preview),
    getImpactSettings(preview),
  ]);

  const sortedDoors = [...doors].sort((a, b) => a.order - b.order);
  const connectionEyebrow = home.connectionEyebrow;
  const connectionHeadline = home.connectionHeadline || home.connectionSection.heading || HOME_CONNECTION_COPY.heading;

  return (
    <>
      <Header variant="transparent" />
      <main>
        <HeroSection block={home.hero} priority />

        <DoorSelectorSection
          doors={sortedDoors}
          heading={home.selectorHeading}
          introduction={home.selectorIntroduction || home.selectorSubheading}
        />

        {sortedDoors.map((door, index) => (
          <HomeExperienceSection key={door.id} door={door} index={index} />
        ))}

        <section className="bg-surface py-20 sm:py-28">
          <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <AnimatedIn className="relative aspect-[4/3] w-full overflow-hidden rounded-card lg:order-2">
              <Media media={home.connectionSection.media} alt="Vista aérea de la finca" />
            </AnimatedIn>
            <AnimatedIn className="lg:order-1" delay={0.1}>
              {connectionEyebrow ? (
                <span className="mb-3 block font-sans text-xs uppercase tracking-[0.25em] text-olive">
                  {connectionEyebrow}
                </span>
              ) : null}
              <h2 className="whitespace-pre-line font-serif text-3xl leading-tight text-text sm:text-4xl">
                {connectionHeadline}
              </h2>
            </AnimatedIn>
          </Container>
        </section>

        <PlastySection home={home} impact={impact} />

        <HomeFinalCta home={home} />
      </main>
      <Footer />
    </>
  );
}
