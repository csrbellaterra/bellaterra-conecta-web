import type { StoryPage } from "@/types/content";
import Container from "@/components/ui/Container";
import Media from "@/components/ui/Media";
import HeroReveal from "@/components/ui/HeroReveal";
import { mediaFieldFromV2 } from "@/lib/media";

/**
 * Hero de /nuestra-historia — deliberadamente distinto del hero de
 * puerta (DoorHero): sin CTA, sin descripción larga, mucho menos
 * texto. Eyebrow + titular + un detalle pequeño y discreto (ej.
 * "1967 — Bellaterra"). La foto es la protagonista.
 */
export default function StoryHero({ story }: { story: StoryPage }) {
  const media = mediaFieldFromV2(story.heroMedia);

  return (
    <section className="relative flex h-[92vh] min-h-[560px] w-full items-end overflow-hidden bg-ink">
      <Media media={media} alt={story.heroHeadline} priority sizes="100vw" className="brightness-[0.8]" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
      <Container className="relative z-10 flex flex-col gap-4 pb-20 sm:pb-24">
        {story.heroEyebrow ? (
          <HeroReveal>
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-white/75">{story.heroEyebrow}</span>
          </HeroReveal>
        ) : null}
        <HeroReveal delay={0.15}>
          <h1 className="max-w-3xl whitespace-pre-line font-serif text-4xl leading-[1.1] text-white sm:text-5xl lg:text-6xl">
            {story.heroHeadline}
          </h1>
        </HeroReveal>
        {story.heroDetail ? (
          <HeroReveal delay={0.3}>
            <span className="font-sans text-sm tracking-[0.15em] text-white/70">{story.heroDetail}</span>
          </HeroReveal>
        ) : null}
      </Container>
    </section>
  );
}
