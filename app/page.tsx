import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { getAllDoors, getHomePage, getImpactSettings } from "@/lib/content";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HomeHero from "@/components/sections/home/HomeHero";
import HomePortals from "@/components/sections/home/HomePortals";
import HomeIdentity from "@/components/sections/home/HomeIdentity";
import PlastySection from "@/components/sections/PlastySection";
import HomeFinalCta from "@/components/sections/HomeFinalCta";
import { HOME_V2_COPY, v2Copy } from "@/lib/homeCopy";

export async function generateMetadata(): Promise<Metadata> {
  const { isEnabled: preview } = draftMode();
  const home = await getHomePage(preview);
  return {
    title: { absolute: v2Copy(home.seo.title, HOME_V2_COPY.seoTitle) },
    description: v2Copy(home.seo.description, HOME_V2_COPY.seoDescription),
  };
}

/**
 * Home V2 (decisión definitiva 31/10/2026): hero con vídeo de fondo →
 * cuatro portales visuales (Empresas, Eventos, Estancias, Comunidad) →
 * cierre de identidad → PLASTY → CTA general de contacto → footer.
 *
 * Las secciones largas por puerta (HomeExperienceSection) y el bloque
 * "Conexión" con media ya no se montan aquí: ese contenido pertenece a
 * cada página de experiencia. Los componentes se conservan.
 *
 * Todo el copy y la media siguen saliendo de Sanity (homePage, door);
 * lib/homeCopy.ts solo aporta fallbacks V2 (ver v2Copy).
 */
export default async function HomePage() {
  const { isEnabled: preview } = draftMode();
  const [home, doors, impact] = await Promise.all([
    getHomePage(preview),
    getAllDoors(preview),
    getImpactSettings(preview),
  ]);

  return (
    <>
      <Header variant="transparent" />
      <main>
        <HomeHero block={home.hero} />

        <HomePortals
          doors={doors}
          heading={home.selectorHeading}
          introduction={home.selectorIntroduction || home.selectorSubheading}
        />

        <HomeIdentity
          eyebrow={home.connectionEyebrow}
          headline={v2Copy(home.connectionHeadline || home.connectionSection.heading, HOME_V2_COPY.identityHeadline)}
        />

        <PlastySection home={home} impact={impact} />

        <HomeFinalCta home={home} />
      </main>
      <Footer />
    </>
  );
}
