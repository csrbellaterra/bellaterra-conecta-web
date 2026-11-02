import type { Door } from "@/types/content";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DoorIntro, { DOOR_INFO_ID } from "@/components/sections/door/DoorIntro";
import { experienceDoor } from "@/lib/doorExperience";
import { withApprovedImages, withPortalImages } from "@/lib/approvedMedia";
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
export default function DoorPageTemplateV2({ door: sanityDoor, allDoors: sanityDoors }: { door: Door; allDoors: Door[] }) {
  // Fotos antiguas de Sanity con personas sin autorización: sustituidas (lib/approvedMedia.ts).
  const door = withApprovedImages(sanityDoor);
  const allDoors = withPortalImages(sanityDoors);
  // CTA y foto de cierre V2 (etiquetas heredadas de la V1 y fotos de 2024 fuera).
  const closingDoor = experienceDoor(door);
  return (
    <>
      <Header variant="transparent" />
      <main>
        <DoorIntro door={door} />
        {/* Bloque B: destino de «Saltar introducción». */}
        <div id={DOOR_INFO_ID} tabIndex={-1} className="scroll-mt-16 outline-none">
          <DoorFeatureBlocks door={door} />
          <DoorTimeline door={door} />
          <DoorSpacesGallery door={door} />
          <DoorPlastyBlock door={door} />
        </div>
        <DoorFinalCta door={closingDoor} />
        <DoorRelatedExperiences door={closingDoor} allDoors={allDoors} />
      </main>
      <Footer />
    </>
  );
}
