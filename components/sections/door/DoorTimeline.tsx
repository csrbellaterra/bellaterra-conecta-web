import type { Door } from "@/types/content";
import Container from "@/components/ui/Container";
import AnimatedIn from "@/components/ui/AnimatedIn";
import { DOOR_PAGE_COPY } from "@/lib/doorCopy";

/**
 * "Una jornada a vuestra manera" (Empresas) / "Un solo evento,
 * diferentes maneras de vivirlo" (Eventos) — storytelling en forma de
 * timeline, NO un horario obligatorio (se comunica explícitamente para
 * Empresas). Lee door.timelineTitle/timelineItems (Sanity) con
 * fallback a lib/doorCopy.ts. `timelineItems` es un campo dedicado,
 * distinto de featureSections, para no mezclar dos propósitos
 * narrativos distintos en un mismo array.
 */
export default function DoorTimeline({ door }: { door: Door }) {
  const copy = DOOR_PAGE_COPY[door.id as "empresas" | "eventos"];
  const title = door.timelineTitle || copy.timeline.title;
  const items =
    door.timelineItems && door.timelineItems.length > 0
      ? door.timelineItems.map((item) => ({ time: item.label ?? "", title: item.title, body: item.body }))
      : copy.timeline.items;

  const isInspiration = door.id === "empresas";

  return (
    <section className="bg-surface py-16 sm:py-24 lg:py-28">
      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
        <AnimatedIn>
          <h2 className="whitespace-pre-line font-serif text-3xl leading-tight text-text sm:text-4xl">{title}</h2>
          {isInspiration ? (
            <p className="mt-4 max-w-sm font-sans text-sm text-muted">
              Esto es una inspiración de jornada, no un horario obligatorio.
            </p>
          ) : null}
        </AnimatedIn>

        <div className="flex flex-col" role="list">
          {items.map((item, index) => (
            <AnimatedIn
              key={`${item.time}-${item.title}`}
              delay={index * 0.06}
              className="flex gap-5 border-t border-border py-5 first:border-t-0 sm:gap-8 sm:py-6"
            >
              <span className="w-16 shrink-0 font-sans text-sm tracking-[0.1em] text-olive sm:w-20 sm:text-base">
                {item.time}
              </span>
              <div className="min-w-0">
                <p className="font-serif text-lg text-text sm:text-xl">{item.title}</p>
                {item.body ? <p className="mt-1 font-sans text-sm text-muted">{item.body}</p> : null}
              </div>
            </AnimatedIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
