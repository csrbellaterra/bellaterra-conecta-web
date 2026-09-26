import type { StoryPage } from "@/types/content";
import Container from "@/components/ui/Container";
import Media from "@/components/ui/Media";
import AnimatedIn from "@/components/ui/AnimatedIn";
import { mediaFieldFromV2 } from "@/lib/media";

/**
 * Frase destacada — uno de los momentos visuales más importantes de
 * toda la web. Gran tipografía editorial, sobre fondo crema limpio
 * por defecto o sobre `statementMedia` (muy sutil) si se ha
 * configurado desde Sanity. Sin sobrecargar: nada más en esta
 * sección.
 */
export default function StoryStatement({ story }: { story: StoryPage }) {
  const media = story.statementMedia ? mediaFieldFromV2(story.statementMedia) : undefined;

  return (
    <section className="relative flex min-h-[70vh] w-full items-center justify-center overflow-hidden bg-surface py-28 sm:py-36">
      {media ? (
        <>
          <Media media={media} alt="" sizes="100vw" className="opacity-25" />
          <div className="absolute inset-0 bg-surface/70" />
        </>
      ) : null}
      <Container className="relative z-10">
        <AnimatedIn>
          <p className="whitespace-pre-line text-center font-serif text-4xl leading-[1.15] tracking-tight text-text sm:text-5xl lg:text-6xl">
            {story.statement}
          </p>
        </AnimatedIn>
      </Container>
    </section>
  );
}
