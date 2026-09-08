import type { HeroBlock } from "@/types/content";
import Media from "@/components/ui/Media";
import ScrollCue from "@/components/ui/ScrollCue";

/**
 * Hero a pantalla completa. Se usa tanto en la home (con el eslogan
 * "Una finca. Cinco formas de vivirla.") como, con textos distintos,
 * en la portada de cada puerta.
 */
export default function HeroSection({ block, priority = true }: { block: HeroBlock; priority?: boolean }) {
  return (
    <section className="relative flex h-[100svh] min-h-[560px] w-full items-end overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <Media media={block.media} alt={block.title} priority={priority} className="brightness-[0.85]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-ink/30" />
      </div>

      <div className="relative z-10 w-full pb-16 pt-32 sm:pb-20">
        <div className="mx-auto flex w-full max-w-content flex-col gap-4 px-5 sm:px-8 lg:px-12">
          {block.eyebrow ? (
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-white/70">{block.eyebrow}</span>
          ) : null}
          <h1 className="max-w-3xl font-serif text-4xl leading-[1.08] text-white sm:text-6xl lg:text-7xl">
            {block.title}
          </h1>
          {block.subtitle ? (
            <p className="max-w-xl font-sans text-base text-white/85 sm:text-lg">{block.subtitle}</p>
          ) : null}
          {block.location ? (
            <p className="font-sans text-sm tracking-wide text-white/70">{block.location}</p>
          ) : null}
        </div>
      </div>

      {block.ctaLabel ? (
        <ScrollCue label={block.ctaLabel} href={block.ctaUrl || "#selector"} />
      ) : null}
    </section>
  );
}
