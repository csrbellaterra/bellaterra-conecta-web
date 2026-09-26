import type { Door, Event } from "@/types/content";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DoorHero from "@/components/sections/door/DoorHero";
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
  door,
  allDoors,
  upcomingFamilyDays,
}: {
  door: Door;
  allDoors: Door[];
  upcomingFamilyDays: Event[];
}) {
  return (
    <>
      <Header variant="transparent" />
      <main>
        <DoorHero door={door} />
        <DoorFeatureBlocks door={door} />
        <DoorUpcomingFamilyDays events={upcomingFamilyDays} />
        <DoorSpacesGallery door={door} />
        <DoorFinalCta door={door} />
        <DoorRelatedExperiences door={door} allDoors={allDoors} />
      </main>
      <Footer />
    </>
  );
}
