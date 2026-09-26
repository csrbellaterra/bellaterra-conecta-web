import Link from "next/link";
import type { Door, FeatureItem, Media as MediaV2, MediaField, SanityImage } from "@/types/content";
import Container from "@/components/ui/Container";
import Media from "@/components/ui/Media";
import AnimatedIn from "@/components/ui/AnimatedIn";
import EditorialMediaList from "@/components/ui/EditorialMediaList";
import { cn } from "@/lib/utils";
import { mediaFieldFromV2 } from "@/lib/media";
import { DOOR_PAGE_COPY, type DoorCopyId } from "@/lib/doorCopy";

function imageAsMediaField(image?: SanityImage): MediaField | undefined {
  if (!image) return undefined;
  return { type: "image", image };
}

function resolveMedia(itemMedia: MediaV2 | undefined, fallbackImage: SanityImage | undefined): MediaField | undefined {
  if (itemMedia) return mediaFieldFromV2(itemMedia);
  return imageAsMediaField(fallbackImage);
}

/**
 * "Qué puedes hacer aquí" (Empresas) / "Qué puedes celebrar" (Eventos)
 * — Fase 3.1: dirección editorial "luxury hospitality" (Passalacqua /
 * Mas Girbau). La finca se descubre, no se cataloga: fuera cards y
 * grids tipo masonry, dentro fotografía protagonista y ritmo
 * editorial. Nueva regla del design system: NO usar cards por defecto
 * para contenido editorial (experiencias, usos, espacios) — las cards
 * quedan solo para interfaces funcionales (selector de puertas, Family
 * Days, formularios, relacionadas).
 *
 * Lee door.featureSections (solo los de tipo featureItem) con fallback
 * a lib/doorCopy.ts cuando el array está vacío en Sanity. Empresas usa
 * tres bloques alternados a ancho completo; Eventos usa una lista
 * editorial numerada + una fotografía grande con crossfade
 * (EditorialMediaList, ver ese componente para el detalle mobile/
 * desktop y prefers-reduced-motion).
 */
export default function DoorFeatureBlocks({ door }: { door: Door }) {
  const copy = DOOR_PAGE_COPY[door.id as DoorCopyId];
  const sanityItems = (door.featureSections?.filter((item) => item._type === "featureItem") as FeatureItem[] | undefined) ?? [];

  const items =
    sanityItems.length > 0
      ? sanityItems.map((item, index) => ({
          title: item.title,
          body: item.body,
          media: resolveMedia(item.media, door.gallery?.[index]),
          ctaLabel: item.ctaLabel,
          ctaUrl: item.ctaUrl,
        }))
      : copy.featureItemsFallback.map((item, index) => ({
          title: item.title,
          body: item.body,
          media: imageAsMediaField(door.gallery?.[index]),
          ctaLabel: item.ctaLabel,
          ctaUrl: item.ctaUrl,
        }));

  const heading = door.featuresTitle || copy.featureSectionsHeading;

  if (door.id === "eventos") {
    return (
      <section className="bg-background py-16 sm:py-24 lg:py-28">
        <Container>
          <AnimatedIn>
            <h2 className="max-w-lg font-serif text-3xl text-text sm:text-4xl">{heading}</h2>
          </AnimatedIn>

          <div className="mt-10 sm:mt-14">
            <EditorialMediaList
              items={items.map((item, index) => ({
                label: String(index + 1).padStart(2, "0"),
                title: item.title,
                body: item.body,
                media: item.media,
              }))}
            />
          </div>
        </Container>
      </section>
    );
  }

  // Empresas: tres bloques editoriales alternados a ancho completo, sin cajas.
  return (
    <section className="bg-background py-16 sm:py-24 lg:py-28">
      <Container>
        <AnimatedIn>
          <h2 className="max-w-lg font-serif text-3xl text-text sm:text-4xl">{heading}</h2>
        </AnimatedIn>
      </Container>

      <div className="mt-10 flex flex-col gap-16 sm:mt-14 sm:gap-24 lg:gap-28">
        {items.map((item, index) => {
          const imageFirst = index % 2 === 1;
          return (
            <Container key={item.title}>
              <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
                <AnimatedIn
                  className={cn("flex flex-col gap-4", imageFirst ? "lg:order-2" : "lg:order-1")}
                  delay={0.05}
                >
                  <span className="font-sans text-xs tracking-[0.15em] text-olive">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-serif text-3xl text-text sm:text-4xl">{item.title}</h3>
                  {item.body ? (
                    <p className="max-w-sm font-sans text-base leading-relaxed text-muted">{item.body}</p>
                  ) : null}
                  {item.ctaLabel ? (
                    <Link
                      href={item.ctaUrl || `/solicitud/${door.slug}`}
                      className="mt-1 inline-flex w-fit items-center gap-2 font-sans text-sm font-medium text-text underline decoration-olive decoration-2 underline-offset-4 transition-colors hover:text-olive"
                    >
                      {item.ctaLabel} <span aria-hidden>→</span>
                    </Link>
                  ) : null}
                </AnimatedIn>

                {item.media ? (
                  <AnimatedIn
                    className={cn(
                      "relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/10] lg:h-[480px] lg:aspect-auto",
                      imageFirst ? "lg:order-1" : "lg:order-2"
                    )}
                  >
                    <Media media={item.media} alt={item.title} sizes="(min-width: 1024px) 55vw, 100vw" />
                  </AnimatedIn>
                ) : null}
              </div>
            </Container>
          );
        })}
      </div>
    </section>
  );
}
