import type { Door, MediaField } from "@/types/content";
import Container from "@/components/ui/Container";
import Media from "@/components/ui/Media";
import AnimatedIn from "@/components/ui/AnimatedIn";
import { cn } from "@/lib/utils";
import { mediaFieldFromV2 } from "@/lib/media";
import { DOOR_PAGE_COPY } from "@/lib/doorCopy";

/**
 * "Espacios" (Empresas) / "Un evento, diferentes espacios" (Eventos)
 * — galería editorial con ritmo (una imagen grande + secundarias, pies
 * de foto opcionales), NO la galería genérica en grid uniforme de la
 * plantilla V1 (ver components/sections/GallerySection.tsx, que sigue
 * usándose sin cambios en Estancias/Comunidad/Pickleball).
 *
 * Lee door.spacesGallery (V2) con fallback a door.gallery (fotos ya
 * publicadas) cuando spacesGallery está vacío, para que la sección
 * tenga fotografía real desde el primer momento.
 */
export default function DoorSpacesGallery({ door }: { door: Door }) {
  const copy = DOOR_PAGE_COPY[door.id as "empresas" | "eventos"];
  const title = door.spacesTitle || copy.spaces.title;

  const items: { media: MediaField; caption?: string }[] =
    door.spacesGallery && door.spacesGallery.length > 0
      ? door.spacesGallery.map((item) => ({ media: mediaFieldFromV2(item.media), caption: item.caption }))
      : (door.gallery ?? []).map((image) => ({ media: { type: "image", image } as MediaField }));

  if (items.length === 0) return null;

  return (
    <section className="bg-background py-16 sm:py-24 lg:py-28">
      <Container>
        <AnimatedIn>
          <h2 className="max-w-lg font-serif text-3xl text-text sm:text-4xl">{title}</h2>
        </AnimatedIn>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {items.map((item, index) => (
            <AnimatedIn
              key={index}
              delay={index * 0.05}
              className={cn(
                "relative overflow-hidden rounded-card",
                index === 0 ? "aspect-[16/10] sm:col-span-2 lg:col-span-2" : "aspect-[4/3]"
              )}
            >
              <Media media={item.media} alt={item.caption ?? ""} sizes="(min-width: 1024px) 45vw, 100vw" />
              {item.caption ? (
                <span className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink/70 to-transparent px-4 py-3 font-sans text-xs text-white/90">
                  {item.caption}
                </span>
              ) : null}
            </AnimatedIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
