import type { ImpactSettings } from "@/types/content";
import Container from "@/components/ui/Container";
import Media from "@/components/ui/Media";
import HeroReveal from "@/components/ui/HeroReveal";
import { mediaFieldFromV2 } from "@/lib/media";

/**
 * Hero de /impacto (Fase 5). Mismo lenguaje visual que el hero de
 * /nuestra-historia (fundido + reveal al cargar, sin CTA propio: el
 * CTA emocional vive al final de la página, ver ImpactFinalCta). A
 * diferencia de StoryHero, aquí sí se muestra un párrafo de cuerpo
 * (heroBody), porque el hero introduce qué es PLASTY antes de entrar
 * en cifras y puertas.
 */
export default function ImpactHero({ impact }: { impact: ImpactSettings }) {
  if (!impact.heroMedia) {
    return (
      <section className="bg-ink py-24 sm:py-32">
        <Container className="flex flex-col gap-4">
          {impact.heroEyebrow ? (
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-white/75">{impact.heroEyebrow}</span>
          ) : null}
          {impact.heroHeadline ? (
            <h1 className="max-w-3xl whitespace-pre-line font-serif text-4xl leading-[1.1] text-white sm:text-5xl lg:text-6xl">
              {impact.heroHeadline}
            </h1>
          ) : null}
          {impact.heroBody ? <p className="max-w-xl font-sans text-base leading-relaxed text-white/85 sm:text-lg">{impact.heroBody}</p> : null}
        </Container>
      </section>
    );
  }

  const media = mediaFieldFromV2(impact.heroMedia);

  return (
    <section className="relative flex h-[80vh] min-h-[520px] w-full items-end overflow-hidden bg-ink">
      <Media media={media} alt={impact.heroHeadline ?? "Impacto"} priority sizes="100vw" className="brightness-[0.8]" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent" />
      <Container className="relative z-10 flex flex-col gap-4 pb-20 sm:pb-24">
        {impact.heroEyebrow ? (
          <HeroReveal>
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-white/75">{impact.heroEyebrow}</span>
          </HeroReveal>
        ) : null}
        <HeroReveal delay={0.1}>
          <h1 className="max-w-3xl whitespace-pre-line font-serif text-4xl leading-[1.1] text-white sm:text-5xl lg:text-6xl">
            {impact.heroHeadline}
          </h1>
        </HeroReveal>
        {impact.heroBody ? (
          <HeroReveal delay={0.2}>
            <p className="max-w-xl font-sans text-base leading-relaxed text-white/85 sm:text-lg">{impact.heroBody}</p>
          </HeroReveal>
        ) : null}
      </Container>
    </section>
  );
}
