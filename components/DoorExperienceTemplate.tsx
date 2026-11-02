import type { Door, FeatureItem, MediaField } from "@/types/content";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/ui/Container";
import AnimatedIn from "@/components/ui/AnimatedIn";
import EditorialMediaList from "@/components/ui/EditorialMediaList";
import DoorIntro, { DOOR_INFO_ID } from "@/components/sections/door/DoorIntro";
import DoorIntroduction from "@/components/sections/door/DoorIntroduction";
import DoorTimeline from "@/components/sections/door/DoorTimeline";
import DoorPlastyBlock from "@/components/sections/door/DoorPlastyBlock";
import DoorFinalCta from "@/components/sections/door/DoorFinalCta";
import DoorRelatedExperiences from "@/components/sections/door/DoorRelatedExperiences";
import { mediaFieldFromV2 } from "@/lib/media";
import { DOOR_PAGE_COPY, type DoorCopyId } from "@/lib/doorCopy";
import { experienceDoor, getDoorExperience, imageMedia } from "@/lib/doorExperience";
import { withApprovedImages, withPortalImages } from "@/lib/approvedMedia";

/**
 * Plantilla de las páginas de experiencia V2 con introducción
 * cinematográfica y bloque B nuevo. De momento solo Empresas; Eventos,
 * Estancias y Comunidad mantienen su bloque B y comparten el bloque A
 * (DoorIntro).
 *
 * A · introducción por scroll (DoorIntro), o el hero normal si la puerta
 *     todavía no tiene escenas.
 * B · información comercial editorial: idea y formatos, una jornada tipo,
 *     espacios y PLASTY.
 * C · CTA final hacia el formulario existente /solicitud/<puerta>.
 *
 * Textos: Sanity primero, campo a campo; lib/doorExperience.ts y
 * lib/doorCopy.ts solo cubren campos vacíos o heredados de la V1.
 */
export default function DoorExperienceTemplate({ door: sanityDoor, allDoors: sanityDoors }: { door: Door; allDoors: Door[] }) {
  // Fotos antiguas de Sanity con personas sin autorización: sustituidas (lib/approvedMedia.ts).
  const door = withApprovedImages(sanityDoor);
  const copy = DOOR_PAGE_COPY[door.id as DoorCopyId];
  const experience = getDoorExperience(door.id);
  const sanityFormats = (door.featureSections?.filter((item) => item._type === "featureItem") as FeatureItem[] | undefined) ?? [];
  const formats = sanityFormats.length > 0 ? sanityFormats : experience?.formats ?? copy.featureItemsFallback;

  const spaces: { label: string; title: string; body?: string; media?: MediaField }[] =
    door.spacesGallery && door.spacesGallery.length > 0
      ? door.spacesGallery.map((item, index) => ({
          label: String(index + 1).padStart(2, "0"),
          title: item.caption || `Espacio ${index + 1}`,
          media: mediaFieldFromV2(item.media),
        }))
      : (experience?.spaces ?? []).map((space, index) => ({
          label: String(index + 1).padStart(2, "0"),
          title: space.title,
          body: space.body,
          media: imageMedia(space.image),
        }));

  // Bloque C y relacionadas con las fotos y textos V2 (portales aprobados de la Home).
  const related = experience?.related ?? [];
  const closingDoor: Door = {
    ...experienceDoor(door),
    relatedExperiences: door.relatedExperiences?.length
      ? door.relatedExperiences
      : related.map((r) => ({ door: r.doorId, note: r.note })),
  };
  const relatedDoors = withPortalImages(sanityDoors);

  return (
    <>
      <Header variant="transparent" />
      <main>
        <DoorIntro door={door} />

        <DoorIntroduction id={DOOR_INFO_ID} door={door} title={door.featuresTitle || copy.featureSectionsHeading} items={formats} />
        <DoorTimeline door={door} />

        {spaces.length > 0 ? (
          <section className="bg-background py-20 sm:py-28">
            <Container>
              <AnimatedIn>
                <h2 className="max-w-lg font-serif text-3xl text-text sm:text-4xl">{door.spacesTitle || copy.spaces.title}</h2>
              </AnimatedIn>
              <div className="mt-10 sm:mt-14">
                <EditorialMediaList items={spaces} />
              </div>
            </Container>
          </section>
        ) : null}

        <DoorPlastyBlock door={door} />
        <DoorFinalCta door={closingDoor} />
        <DoorRelatedExperiences door={closingDoor} allDoors={relatedDoors} />
      </main>
      <Footer />
    </>
  );
}
