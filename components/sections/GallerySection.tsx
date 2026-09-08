import Image from "next/image";
import type { GalleryBlock } from "@/types/content";
import Container from "@/components/ui/Container";
import AnimatedIn from "@/components/ui/AnimatedIn";

export default function GallerySection({ block }: { block: GalleryBlock }) {
  if (!block.images?.length) return null;

  return (
    <section className="bg-background py-16 sm:py-24">
      <Container>
        {block.heading ? (
          <AnimatedIn className="mb-10">
            <h2 className="font-serif text-3xl text-text sm:text-4xl">{block.heading}</h2>
          </AnimatedIn>
        ) : null}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {block.images.map((image, index) => (
            <AnimatedIn
              key={image.url}
              delay={index * 0.05}
              className={index % 5 === 0 ? "relative col-span-2 aspect-[16/10] overflow-hidden rounded-card sm:col-span-2" : "relative aspect-square overflow-hidden rounded-card"}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="(min-width: 640px) 33vw, 50vw"
                className="object-cover"
                style={image.hotspot ? { objectPosition: `${image.hotspot.x}% ${image.hotspot.y}%` } : undefined}
              />
            </AnimatedIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
