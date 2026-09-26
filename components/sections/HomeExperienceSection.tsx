import Link from "next/link";
import type { Door } from "@/types/content";
import Container from "@/components/ui/Container";
import Media from "@/components/ui/Media";
import AnimatedIn from "@/components/ui/AnimatedIn";
import { cn } from "@/lib/utils";
import { HOME_DOOR_COPY } from "@/lib/homeCopy";
import { mediaFieldFromV2 } from "@/lib/media";

/**
 * Las 5 secciones editoriales de la home (una por puerta, alternando
 * lado de la imagen). Lee door.homeEyebrow/homeHeadline/
 * homeDescription/homeCtaLabel/homeMedia desde Sanity — con fallback
 * al copy aprobado del prompt V2 (lib/homeCopy.ts) cuando el campo
 * todavía no se ha rellenado. Distinto del texto propio de cada
 * página de puerta (door.eyebrow/introduction/headline), que sigue
 * viviendo aparte para /empresas, /eventos, etc. El CTA lleva a la
 * página de la puerta (/empresas), NUNCA directamente al formulario:
 * cada página de puerta tiene sus propios CTAs comerciales.
 *
 * Fotografía más grande y con más peso que en V1 (sección 13 del
 * prompt: "fotografías mayores, mejor jerarquía, composición
 * editorial") — imagen a mayor altura en desktop, texto más contenido
 * para dejar respirar la composición.
 */
export default function HomeExperienceSection({ door, index }: { door: Door; index: number }) {
  const fallback = HOME_DOOR_COPY[door.id];
  const eyebrow = door.homeEyebrow || fallback.eyebrow;
  const headline = door.homeHeadline || door.headline || fallback.headline;
  const description = door.homeDescription || fallback.body;
  const ctaLabel = door.homeCtaLabel || fallback.ctaLabel;
  const media = door.homeMedia ? mediaFieldFromV2(door.homeMedia) : door.heroMedia;
  const imageFirst = index % 2 === 0;

  return (
    <section className="bg-background py-16 sm:py-24 lg:py-28">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <AnimatedIn
            className={cn(
              "relative aspect-[4/5] w-full overflow-hidden rounded-card sm:aspect-[16/11] lg:aspect-[4/5] lg:h-[560px]",
              imageFirst ? "lg:order-1" : "lg:order-2"
            )}
          >
            <Media media={media} alt={headline} sizes="(min-width: 1024px) 55vw, 100vw" />
          </AnimatedIn>

          <AnimatedIn className={cn("flex flex-col gap-5", imageFirst ? "lg:order-2" : "lg:order-1")} delay={0.1}>
            <span className="font-sans text-xs uppercase tracking-[0.25em] text-olive">{eyebrow}</span>
            <h2 className="whitespace-pre-line font-serif text-3xl leading-tight text-text sm:text-4xl lg:text-[2.75rem]">
              {headline}
            </h2>
            <p className="max-w-md font-sans text-base leading-relaxed text-muted">{description}</p>
            <Link
              href={`/${door.slug}`}
              className="mt-2 inline-flex w-fit items-center gap-2 font-sans text-sm font-medium text-text underline decoration-olive decoration-2 underline-offset-4 transition-colors hover:text-olive"
            >
              {ctaLabel} <span aria-hidden>→</span>
            </Link>
          </AnimatedIn>
        </div>
      </Container>
    </section>
  );
}
