import type { Door } from "@/types/content";
import Container from "@/components/ui/Container";
import DoorCard from "@/components/ui/DoorCard";
import AnimatedIn from "@/components/ui/AnimatedIn";
import { HOME_DOOR_COPY, HOME_SELECTOR_COPY } from "@/lib/homeCopy";

/**
 * Selector de las 5 puertas — filas accionables, NO cards verticales
 * de foto completa. Las 5 se muestran siempre a la vez (desktop:
 * lista vertical de filas; nunca un carrusel).
 *
 * El texto de cada fila usa door.homeEyebrow (Sanity) — el mismo
 * campo que el "texto superior" de la sección editorial de esta
 * puerta más abajo en la home — con fallback al copy aprobado
 * (HOME_DOOR_COPY) si todavía no se ha rellenado. heading/introduction
 * vienen de homePage.selectorHeading/selectorIntroduction (Sanity),
 * con su propio fallback.
 */
export default function DoorSelectorSection({
  doors,
  heading,
  introduction,
}: {
  doors: Door[];
  heading?: string;
  introduction?: string;
}) {
  const sorted = [...doors].sort((a, b) => a.order - b.order);

  return (
    <section id="selector" className="bg-background py-16 sm:py-24 lg:py-28">
      <Container>
        <AnimatedIn className="mx-auto mb-10 max-w-2xl text-center sm:mb-16">
          <h2 className="font-serif text-3xl text-text sm:text-4xl lg:text-[2.5rem]">{heading || HOME_SELECTOR_COPY.heading}</h2>
          <p className="mt-4 font-sans text-base leading-relaxed text-muted">
            {introduction || HOME_SELECTOR_COPY.introduction}
          </p>
        </AnimatedIn>

        <div className="mx-auto max-w-3xl border-t border-border">
          {sorted.map((door, index) => {
            const description = door.homeEyebrow || HOME_DOOR_COPY[door.id].eyebrow;
            return (
              <AnimatedIn key={door.id} delay={index * 0.06}>
                <DoorCard door={door} description={description} />
              </AnimatedIn>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
