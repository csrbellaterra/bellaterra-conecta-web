import Link from "next/link";
import type { Door } from "@/types/content";
import Container from "@/components/ui/Container";
import Media from "@/components/ui/Media";
import HeroReveal from "@/components/ui/HeroReveal";
import { mediaFieldFromV2 } from "@/lib/media";
import { DOOR_PAGE_COPY } from "@/lib/doorCopy";

/**
 * Hero a pantalla completa de la nueva plantilla de puerta (V2),
 * usado solo por Empresas y Eventos (Fase 3) — mismo lenguaje visual
 * que el hero de la Home (fundido + ligero desplazamiento al cargar,
 * NO al hacer scroll, ver HeroReveal).
 *
 * Copy: door.heroEyebrow/heroHeadline/heroDescription/primaryCtaLabel
 * (Sanity) → door.eyebrow/headline/introduction/ctaLabel (heredado) →
 * lib/doorCopy.ts (fallback aprobado). Media: door.heroMobileMedia
 * (V2, opcional) para móvil, door.heroMedia (obligatorio, ya
 * publicado) para el resto — se combinan en un único MediaField para
 * que <Media> siga siendo el único componente que sabe pintar
 * imagen/vídeo/mobile/poster.
 */
export default function DoorHero({ door }: { door: Door }) {
  const copy = DOOR_PAGE_COPY[door.id as "empresas" | "eventos"];
  const eyebrow = door.heroEyebrow || door.eyebrow || copy.hero.eyebrow;
  const headline = door.heroHeadline || door.headline || copy.hero.headline;
  const description = door.heroDescription || door.introduction || copy.hero.description;
  const ctaLabel = door.primaryCtaLabel || door.ctaLabel || copy.hero.ctaLabel;

  const mobile = door.heroMobileMedia;
  const media = mobile
    ? {
        ...door.heroMedia,
        mobileImage: mobile.image ?? door.heroMedia.mobileImage,
        mobileVideoUrl: mobile.videoUrl ?? door.heroMedia.mobileVideoUrl,
      }
    : door.heroMedia;

  return (
    <section className="relative flex h-[92vh] min-h-[560px] w-full items-end overflow-hidden bg-ink">
      <Media media={media} alt={headline} priority sizes="100vw" className="brightness-[0.82]" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent" />
      <Container className="relative z-10 flex flex-col gap-5 pb-20 sm:pb-24">
        <HeroReveal>
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-white/75">{eyebrow}</span>
        </HeroReveal>
        <HeroReveal delay={0.1}>
          <h1 className="max-w-3xl whitespace-pre-line font-serif text-4xl leading-[1.1] text-white sm:text-5xl lg:text-6xl">
            {headline}
          </h1>
        </HeroReveal>
        <HeroReveal delay={0.2}>
          <p className="max-w-xl font-sans text-base leading-relaxed text-white/85 sm:text-lg">{description}</p>
        </HeroReveal>
        <HeroReveal delay={0.3}>
          <Link
            href={`/solicitud/${door.slug}`}
            className="mt-2 inline-flex w-fit items-center gap-2 rounded-pill bg-white px-7 py-3 font-sans text-sm font-medium tracking-wide text-ink transition-colors hover:bg-olive hover:text-white"
          >
            {ctaLabel} <span aria-hidden>→</span>
          </Link>
        </HeroReveal>
      </Container>
    </section>
  );
}
