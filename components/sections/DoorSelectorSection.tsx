import type { Door, DoorSelectorBlock } from "@/types/content";
import Container from "@/components/ui/Container";
import DoorCard from "@/components/ui/DoorCard";
import AnimatedIn from "@/components/ui/AnimatedIn";

/**
 * Las 5 puertas mostradas SIEMPRE a la vez, en una fila (grid que se
 * envuelve en móvil) — explícitamente NO un carrusel, según la
 * maqueta aprobada.
 */
export default function DoorSelectorSection({ block, doors }: { block: DoorSelectorBlock; doors: Door[] }) {
  const sorted = [...doors].sort((a, b) => a.order - b.order);

  return (
    <section id="selector" className="bg-background py-20 sm:py-28">
      <Container>
        <AnimatedIn className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          <h2 className="font-serif text-3xl text-text sm:text-4xl">{block.heading}</h2>
          {block.subheading ? (
            <p className="mt-3 font-sans text-base text-muted">{block.subheading}</p>
          ) : null}
        </AnimatedIn>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {sorted.map((door, index) => (
            <AnimatedIn key={door.id} delay={index * 0.06}>
              <DoorCard door={door} />
            </AnimatedIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
