import type { Door, FeatureItem, Media as MediaV2, MediaField, SanityImage } from "@/types/content";
import Container from "@/components/ui/Container";
import Media from "@/components/ui/Media";
import AnimatedIn from "@/components/ui/AnimatedIn";
import { cn } from "@/lib/utils";
import { mediaFieldFromV2 } from "@/lib/media";
import { DOOR_PAGE_COPY } from "@/lib/doorCopy";

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
 * — bloques visuales grandes, NO tarjetas pequeñas tipo SaaS. Lee
 * door.featureSections (solo los de tipo featureItem; los timelineItem
 * que pueda contener ese mismo array se ignoran aquí, ver
 * DoorTimeline para esos) con fallback a lib/doorCopy.ts cuando el
 * array está vacío en Sanity. Composición asimétrica en desktop
 * (el primer bloque ocupa más espacio), stack limpio en mobile.
 */
export default function DoorFeatureBlocks({ door }: { door: Door }) {
  const copy = DOOR_PAGE_COPY[door.id as "empresas" | "eventos"];
  const sanityItems = (door.featureSections?.filter((item) => item._type === "featureItem") as FeatureItem[] | undefined) ?? [];

  const items =
    sanityItems.length > 0
      ? sanityItems.map((item, index) => ({
          title: item.title,
          body: item.body,
          media: resolveMedia(item.media, door.gallery?.[index]),
        }))
      : copy.featureItemsFallback.map((item, index) => ({
          title: item.title,
          body: item.body,
          media: imageAsMediaField(door.gallery?.[index]),
        }));

  return (
    <section className="bg-background py-16 sm:py-24 lg:py-28">
      <Container>
        <AnimatedIn>
          <h2 className="max-w-lg font-serif text-3xl text-text sm:text-4xl">
            {door.featuresTitle || copy.featureSectionsHeading}
          </h2>
        </AnimatedIn>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {items.map((item, index) => (
            <AnimatedIn
              key={item.title}
              delay={index * 0.08}
              className={cn(
                "flex flex-col overflow-hidden rounded-card bg-surface",
                index === 0 ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : ""
              )}
            >
              {item.media ? (
                <div className={cn("relative w-full", index === 0 ? "aspect-[16/10] lg:aspect-[16/9]" : "aspect-[4/3]")}>
                  <Media media={item.media} alt={item.title} sizes="(min-width: 1024px) 45vw, 100vw" />
                </div>
              ) : null}
              <div className="flex flex-1 flex-col gap-2 p-6 sm:p-7">
                <h3 className="font-serif text-xl text-text sm:text-2xl">{item.title}</h3>
                {item.body ? <p className="font-sans text-sm leading-relaxed text-muted sm:text-base">{item.body}</p> : null}
              </div>
            </AnimatedIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
