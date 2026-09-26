import type { HeroBlock } from "@/types/content";
import Media from "@/components/ui/Media";
import ScrollCue from "@/components/ui/ScrollCue";
import HeroReveal from "@/components/ui/HeroReveal";

/**
 * Hero a pantalla completa. Se usa tanto en la home (con el eslogan
 * "Una finca. Cinco formas de vivirla.") como, con textos distintos,
 * en la portada de cada puerta. El título se parte visualmente en
 * varias líneas cuando tiene más de una frase (ej. "Una finca." /
 * "Cinco formas de vivirla.") — el texto sigue siendo 100% editable
 * desde Sanity, solo cambia cómo se reparte en líneas.
 */
function splitTitleLines(title: string): string[] {
  const parts = title.split(". ").map((p) => p.trim()).filter(Boolean);
  if (parts.length <= 1) return [title];
  return parts.map((part, i) => (i < parts.length - 1 && !part.endsWith(".") ? `${part}.` : part));
}

export default function HeroSection({ block, priority = true }: { block: HeroBlock; priority?: boolean }) {
  const titleLines = splitTitleLines(block.title);

  return (
    <section className="relative flex h-[100svh] min-h-[600px] w-full items-end overflow-hidden bg-ink">
      <div className="absolute inset-0">
        {/*
          La foto/vídeo debe sentirse protagonista (sección 5): se
          reduce el oscurecimiento respecto a la versión anterior
          (brightness-[0.8] → 0.9, gradiente más corto y más claro) —
          justo lo necesario para que el texto siga siendo legible
          sobre cualquier fotografía, sin lavar la imagen entera.
        */}
        <Media media={block.media} alt={block.title} priority={priority} className="scale-[1.02] brightness-[0.92]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/5 to-transparent" />
      </div>

      <div className="relative z-10 w-full pb-24 pt-32 sm:pb-28 lg:pb-32">
        <div className="mx-auto flex w-full max-w-content flex-col gap-6 px-5 sm:px-8 lg:px-12">
          {block.eyebrow ? (
            <HeroReveal delay={0}>
              <span className="font-sans text-xs uppercase tracking-[0.35em] text-white/75">{block.eyebrow}</span>
            </HeroReveal>
          ) : null}

          <HeroReveal delay={0.1}>
            <h1 className="max-w-4xl font-serif text-[3.25rem] leading-[1.05] text-white sm:text-7xl lg:text-[5.75rem]">
              {titleLines.map((line, i) => (
                <span key={i} className="block drop-shadow-[0_2px_16px_rgba(20,19,15,0.35)]">
                  {line}
                </span>
              ))}
            </h1>
          </HeroReveal>

          {block.subtitle ? (
            <HeroReveal delay={0.2}>
              <p className="max-w-xl font-sans text-base text-white/85 sm:text-lg">{block.subtitle}</p>
            </HeroReveal>
          ) : null}

          {block.location ? (
            <HeroReveal delay={0.28}>
              <p className="font-sans text-sm tracking-[0.15em] text-white/70">{block.location}</p>
            </HeroReveal>
          ) : null}
        </div>
      </div>

      {block.ctaLabel ? (
        <ScrollCue label={block.ctaLabel} href={block.ctaUrl || "#selector"} />
      ) : null}
    </section>
  );
}
