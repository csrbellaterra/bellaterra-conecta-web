import type { Door, Event } from "@/types/content";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DoorIntro, { DOOR_INFO_ID } from "@/components/sections/door/DoorIntro";
import { experienceDoor } from "@/lib/doorExperience";
import { withApprovedImages, withPortalImages } from "@/lib/approvedMedia";
import DoorFeatureBlocks from "@/components/sections/door/DoorFeatureBlocks";
import DoorUpcomingFamilyDays from "@/components/sections/door/DoorUpcomingFamilyDays";
import DoorSpacesGallery from "@/components/sections/door/DoorSpacesGallery";
import DoorFinalCta from "@/components/sections/door/DoorFinalCta";
import DoorRelatedExperiences from "@/components/sections/door/DoorRelatedExperiences";

/**
 * Plantilla propia de Comunidad (Fase 4A) — NO reutiliza
 * DoorPageTemplateV2 (Empresas/Eventos/Estancias) tal cual, porque
 * Comunidad tiene una narrativa distinta: es la página viva de los
 * Family Days, no tiene un modelo PLASTY definido todavía (se omite
 * el bloque PLASTY a propósito, ver lib/doorCopy.ts) y necesita una
 * sección exclusiva de "Próximos Family Days" leída en vivo desde
 * Sanity (`event`), que no existe en ninguna otra puerta.
 *
 * Hero (con la explicación de qué es Comunidad en heroDescription) →
 * "Cómo participar" (bloques alternados, reutiliza DoorFeatureBlocks)
 * → Próximos Family Days (cards, único uso de cards de esta página,
 * ver comentario en DoorUpcomingFamilyDays) → Deporte/convivencia
 * (lista editorial + imagen, reutiliza DoorSpacesGallery) → CTA final
 * → relacionadas (Pickleball/Eventos).
 */
export default function DoorPageTemplateComunidad({
  door: sanityDoor,
  allDoors: sanityDoors,
  upcomingFamilyDays: sanityFamilyDays,
}: {
  door: Door;
  allDoors: Door[];
  upcomingFamilyDays: Event[];
}) {
  // Fotos antiguas de Sanity con personas sin autorización: sustituidas (lib/approvedMedia.ts).
  const door = withApprovedImages(sanityDoor);
  const allDoors = withPortalImages(sanityDoors);
  const upcomingFamilyDays = withApprovedImages(sanityFamilyDays);
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
          <DoorUpcomingFamilyDays events={upcomingFamilyDays} />
          <DoorSpacesGallery door={door} />
        </div>
        <DoorFinalCta door={closingDoor} />
        <DoorRelatedExperiences door={closingDoor} allDoors={allDoors} />
      </main>
      <Footer />
    </>
  );
}
