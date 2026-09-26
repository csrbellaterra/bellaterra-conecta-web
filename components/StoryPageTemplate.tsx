import type { StoryPage } from "@/types/content";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StoryHero from "@/components/sections/historia/StoryHero";
import StoryTextMedia from "@/components/sections/historia/StoryTextMedia";
import StoryIdentity from "@/components/sections/historia/StoryIdentity";
import StoryStatement from "@/components/sections/historia/StoryStatement";
import StoryTimeline from "@/components/sections/historia/StoryTimeline";
import StoryFinalCta from "@/components/sections/historia/StoryFinalCta";
import { mediaFieldFromV2 } from "@/lib/media";

/**
 * Plantilla de /nuestra-historia (Fase 4B) — página más emocional y
 * editorial de la web. NO reutiliza mecánicamente Hero + 3 bloques +
 * galería + PLASTY de las puertas: tiene una narrativa propia, fijada
 * en código, con Sanity controlando solo contenido y media (ver
 * sanity/schemaTypes/documents/storyPage.ts).
 *
 * Hero → De dónde venimos → Qué somos (5 verbos) → Frase destacada →
 * Hacia dónde vamos (con parallax sutil) → Timeline opcional → CTA
 * final (sin PLASTY, sin contador — eso lo desarrolla /impacto).
 */
export default function StoryPageTemplate({ story }: { story: StoryPage }) {
  return (
    <>
      <Header variant="transparent" />
      <main>
        <StoryHero story={story} />

        <StoryTextMedia
          title={story.originTitle}
          body={story.originBody}
          media={story.originMedia ? mediaFieldFromV2(story.originMedia) : undefined}
          imageSide="right"
        />

        <StoryIdentity story={story} />

        <StoryStatement story={story} />

        <StoryTextMedia
          title={story.futureTitle}
          body={story.futureBody}
          media={story.futureMedia ? mediaFieldFromV2(story.futureMedia) : undefined}
          imageSide="left"
          parallax
        />

        <StoryTimeline story={story} />

        <StoryFinalCta story={story} />
      </main>
      <Footer />
    </>
  );
}
