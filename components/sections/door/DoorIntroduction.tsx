import type { Door } from "@/types/content";
import Container from "@/components/ui/Container";
import AnimatedIn from "@/components/ui/AnimatedIn";

/**
 * Apertura del bloque B de las páginas de experiencia: la idea de la puerta
 * (door.headline) y su descripción (door.introduction), más una lista
 * editorial numerada de formatos — sin cards ni fotos, porque la
 * introducción cinematográfica ya acaba de enseñar los espacios.
 */
export default function DoorIntroduction({
  id,
  door,
  title,
  items,
}: {
  id: string;
  door: Door;
  title: string;
  items: { title: string; body?: string }[];
}) {
  return (
    <section id={id} tabIndex={-1} className="scroll-mt-16 outline-none bg-background py-20 sm:py-28 lg:py-32">
      <Container className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <AnimatedIn>
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-olive">{door.name}</span>
          <h2 className="mt-5 max-w-xl font-serif text-4xl leading-[1.1] text-text sm:text-5xl">{door.headline}</h2>
        </AnimatedIn>
        <AnimatedIn delay={0.08} className="lg:pt-12">
          <p className="max-w-lg font-sans text-base leading-relaxed text-muted sm:text-lg">{door.introduction}</p>
        </AnimatedIn>
      </Container>

      <Container className="mt-16 sm:mt-24">
        <AnimatedIn>
          <h3 className="font-serif text-2xl text-text sm:text-3xl">{title}</h3>
        </AnimatedIn>
        <ol className="mt-8 grid grid-cols-1 gap-x-16 sm:mt-10 lg:grid-cols-2">
          {items.map((item, index) => (
            <li key={item.title} className="border-t border-border py-7 sm:py-8">
              <AnimatedIn delay={index * 0.05} className="flex gap-6 sm:gap-8">
                <span className="w-6 shrink-0 pt-1.5 font-sans text-xs tracking-[0.15em] text-olive">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-serif text-2xl text-text">{item.title}</p>
                  {item.body ? <p className="mt-2 max-w-md font-sans text-sm leading-relaxed text-muted sm:text-base">{item.body}</p> : null}
                </div>
              </AnimatedIn>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
