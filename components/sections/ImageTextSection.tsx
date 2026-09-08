import Link from "next/link";
import type { ExperienceBlock, ImageTextBlock } from "@/types/content";
import Container from "@/components/ui/Container";
import Media from "@/components/ui/Media";
import AnimatedIn from "@/components/ui/AnimatedIn";
import { cn } from "@/lib/utils";

/**
 * Sección alternada imagen/texto. Sirve tanto para imageTextSection
 * como para experienceSection (que añade un doorId opcional pero
 * comparte exactamente el mismo diseño) — son las 5 secciones de
 * "Salir de la oficina cambia la conversación.", etc. en la home.
 */
export default function ImageTextSection({ block }: { block: ImageTextBlock | ExperienceBlock }) {
  const imageFirst = block.imageSide !== "right";

  return (
    <section className="bg-background py-16 sm:py-24">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <AnimatedIn
            className={cn(
              "relative aspect-[4/5] w-full overflow-hidden rounded-card sm:aspect-[16/11] lg:aspect-[4/5]",
              imageFirst ? "lg:order-1" : "lg:order-2"
            )}
          >
            <Media media={block.media} alt={block.headline} sizes="(min-width: 1024px) 50vw, 100vw" />
          </AnimatedIn>

          <AnimatedIn className={cn("flex flex-col gap-5", imageFirst ? "lg:order-2" : "lg:order-1")} delay={0.1}>
            {block.eyebrow ? (
              <span className="font-sans text-xs uppercase tracking-[0.25em] text-olive">{block.eyebrow}</span>
            ) : null}
            <h2 className="font-serif text-3xl leading-tight text-text sm:text-4xl">{block.headline}</h2>
            <p className="max-w-md font-sans text-base leading-relaxed text-muted">{block.body}</p>
            {block.ctaLabel && block.ctaUrl ? (
              <Link
                href={block.ctaUrl}
                className="mt-2 inline-flex w-fit items-center gap-2 font-sans text-sm font-medium text-text underline decoration-olive decoration-2 underline-offset-4 transition-colors hover:text-olive"
              >
                {block.ctaLabel} <span aria-hidden>→</span>
              </Link>
            ) : null}
          </AnimatedIn>
        </div>
      </Container>
    </section>
  );
}
