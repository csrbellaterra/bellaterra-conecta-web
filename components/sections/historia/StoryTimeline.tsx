import type { StoryPage } from "@/types/content";
import Container from "@/components/ui/Container";
import AnimatedIn from "@/components/ui/AnimatedIn";

/**
 * Timeline editorial opcional (ej. 1967 / Hoy / Mañana) — solo se
 * renderiza si `timelineEnabled` está activo y hay items cargados
 * desde Sanity. No inventa fechas: si no hay contenido, no se monta
 * (ver StoryPageTemplate).
 */
export default function StoryTimeline({ story }: { story: StoryPage }) {
  if (!story.timelineEnabled || !story.timelineItems || story.timelineItems.length === 0) return null;

  return (
    <section className="bg-background py-20 sm:py-28">
      <Container>
        <div className="flex flex-col" role="list">
          {story.timelineItems.map((item, index) => (
            <AnimatedIn
              key={`${item.label ?? ""}-${item.title}`}
              delay={index * 0.06}
              className="flex gap-6 border-t border-border py-6 first:border-t-0 sm:gap-10 sm:py-8"
            >
              <span className="w-20 shrink-0 font-sans text-sm tracking-[0.1em] text-olive sm:w-24 sm:text-base">
                {item.label}
              </span>
              <div className="min-w-0">
                <p className="font-serif text-xl text-text sm:text-2xl">{item.title}</p>
                {item.body ? <p className="mt-1 font-sans text-sm text-muted sm:text-base">{item.body}</p> : null}
              </div>
            </AnimatedIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
