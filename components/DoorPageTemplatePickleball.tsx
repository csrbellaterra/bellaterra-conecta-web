import type { Door, Event } from "@/types/content";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DoorHero from "@/components/sections/door/DoorHero";
import DoorFeatureBlocks from "@/components/sections/door/DoorFeatureBlocks";
import DoorSpacesGallery from "@/components/sections/door/DoorSpacesGallery";
import DoorUpcomingFamilyDays from "@/components/sections/door/DoorUpcomingFamilyDays";
import DoorFinalCta from "@/components/sections/door/DoorFinalCta";
import DoorRelatedExperiences from "@/components/sections/door/DoorRelatedExperiences";

/**
 * Plantilla propia de Pickleball (Fase 4B) — no reutiliza
 * DoorPageTemplateV2 tal cual: sin bloque PLASTY (la escuela/matrícula
 * ya no existe y el nuevo modelo de impacto todavía no está definido,
 * ver CLAUDE.md → Content policy) y con una sección propia de
 * "Próximos Family Days" leída en vivo desde Sanity, igual que en
 * Comunidad.
 *
 * Hero → "Tres formas de vivir el pickleball" (bloques alternados,
 * reutiliza DoorFeatureBlocks) → "Las pistas" (lista editorial +
 * imagen, reutiliza DoorSpacesGallery) → Próximos Family Days → CTA
 * final ("Organiza una actividad") → relacionadas (Empresas/
 * Comunidad/Eventos).
 */
export default function DoorPageTemplatePickleball({
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
        <DoorSpacesGallery door={door} />
        <DoorUpcomingFamilyDays events={upcomingFamilyDays} />
        <DoorFinalCta door={door} />
        <DoorRelatedExperiences door={door} allDoors={allDoors} />
      </main>
      <Footer />
    </>
  );
}
