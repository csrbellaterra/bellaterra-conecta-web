import type { Door, MediaField } from "@/types/content";
import Container from "@/components/ui/Container";
import AnimatedIn from "@/components/ui/AnimatedIn";
import EditorialMediaList from "@/components/ui/EditorialMediaList";
import { mediaFieldFromV2 } from "@/lib/media";
import { DOOR_PAGE_COPY } from "@/lib/doorCopy";

/**
 * "Espacios" (Empresas) / "Un evento, diferentes espacios" (Eventos)
 * — Fase 3.1: navegación/lista editorial (Interior, Terraza, Jardín,
 * Piscina, Barbacoa...) asociada a una única fotografía grande que
 * cambia al hacer hover/focus sobre cada espacio (EditorialMediaList),
 * NO la galería tipo masonry que había antes justo debajo de esta
 * sección — esa galería genérica desaparece por completo aquí.
 *
 * Lee door.spacesGallery (V2, caption = nombre del espacio) con
 * fallback a lib/doorCopy.ts (nombres) + door.gallery (fotos ya
 * publicadas) cuando spacesGallery está vacío.
 */
export default function DoorSpacesGallery({ door }: { door: Door }) {
  const copy = DOOR_PAGE_COPY[door.id as "empresas" | "eventos"];
  const title = door.spacesTitle || copy.spaces.title;

  const items: { label: string; title: string; media?: MediaField }[] =
    door.spacesGallery && door.spacesGallery.length > 0
      ? door.spacesGallery.map((item, index) => ({
          label: String(index + 1).padStart(2, "0"),
          title: item.caption || copy.spaces.itemsFallback[index] || `Espacio ${index + 1}`,
          media: mediaFieldFromV2(item.media),
        }))
      : copy.spaces.itemsFallback.map((name, index) => ({
          label: String(index + 1).padStart(2, "0"),
          title: name,
          media: door.gallery?.[index] ? ({ type: "image", image: door.gallery[index] } as MediaField) : undefined,
        }));

  if (items.length === 0) return null;

  return (
    <section className="bg-surface py-16 sm:py-24 lg:py-28">
      <Container>
        <AnimatedIn>
          <h2 className="max-w-lg font-serif text-3xl text-text sm:text-4xl">{title}</h2>
        </AnimatedIn>

        <div className="mt-10 sm:mt-14">
          <EditorialMediaList items={items} />
        </div>
      </Container>
    </section>
  );
}
