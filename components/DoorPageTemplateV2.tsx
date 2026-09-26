import type { Door } from "@/types/content";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DoorHero from "@/components/sections/door/DoorHero";
import DoorFeatureBlocks from "@/components/sections/door/DoorFeatureBlocks";
import DoorTimeline from "@/components/sections/door/DoorTimeline";
import DoorSpacesGallery from "@/components/sections/door/DoorSpacesGallery";
import DoorPlastyBlock from "@/components/sections/door/DoorPlastyBlock";
import DoorFinalCta from "@/components/sections/door/DoorFinalCta";
import DoorRelatedExperiences from "@/components/sections/door/DoorRelatedExperiences";

/**
 * Plantilla V2 de página de puerta — Fase 3, usada SOLO por Empresas y
 * Eventos. Paralela a components/DoorPageTemplate.tsx (V1), que sigue
 * sirviendo Estancias/Comunidad/Pickleball sin ningún cambio. Cuando
 * esas tres puertas se rediseñen en una fase futura, podrán migrar a
 * esta misma plantilla o a una propia — no se decide aquí.
 *
 * Hero a pantalla completa → "qué puedes hacer/celebrar" → timeline/
 * storytelling → espacios → PLASTY → CTA final → relacionadas.
 * Cabecera transparente sobre el hero (mismo lenguaje que la Home),
 * a diferencia de DoorPageTemplate (V1), que usa variant="solid".
 */
export default function DoorPageTemplateV2({ door, allDoors }: { door: Door; allDoors: Door[] }) {
  return (
    <>
      <Header variant="transparent" />
      <main>
        <DoorHero door={door} />
        <DoorFeatureBlocks door={door} />
        <DoorTimeline door={door} />
        <DoorSpacesGallery door={door} />
        <DoorPlastyBlock door={door} />
        <DoorFinalCta door={door} />
        <DoorRelatedExperiences door={door} allDoors={allDoors} />
      </main>
      <Footer />
    </>
  );
}
