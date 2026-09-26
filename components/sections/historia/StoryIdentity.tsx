import type { StoryPage } from "@/types/content";
import Container from "@/components/ui/Container";
import AnimatedIn from "@/components/ui/AnimatedIn";
import EditorialMediaList from "@/components/ui/EditorialMediaList";
import { mediaFieldFromV2 } from "@/lib/media";

/**
 * "Qué somos" — los cinco verbos (CELEBRAR, TRABAJAR, QUEDARSE,
 * PARTICIPAR, JUGAR) como identidad de marca, no como navegación
 * funcional: reutiliza EditorialMediaList (lista editorial + una
 * fotografía/vídeo grande que cambia con hover/focus), exactamente lo
 * que pide el prompt — "no convertirlos en cinco cards".
 */
export default function StoryIdentity({ story }: { story: StoryPage }) {
  const items = (story.identityItems ?? []).map((item) => ({
    label: "",
    title: item.title,
    media: item.media ? mediaFieldFromV2(item.media) : undefined,
  }));

  if (items.length === 0) return null;

  return (
    <section className="bg-surface py-20 sm:py-28 lg:py-32">
      <Container>
        <AnimatedIn className="max-w-xl">
          {story.identityTitle ? (
            <h2 className="font-serif text-3xl leading-tight text-text sm:text-4xl">{story.identityTitle}</h2>
          ) : null}
          <p className="mt-4 font-sans text-base leading-relaxed text-muted sm:text-lg">{story.identityBody}</p>
        </AnimatedIn>

        <div className="mt-10 sm:mt-14">
          <EditorialMediaList items={items} />
        </div>
      </Container>
    </section>
  );
}
