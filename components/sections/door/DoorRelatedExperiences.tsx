import Link from "next/link";
import Image from "next/image";
import type { Door } from "@/types/content";
import Container from "@/components/ui/Container";
import AnimatedIn from "@/components/ui/AnimatedIn";
import { DOOR_PAGE_COPY } from "@/lib/doorCopy";

/**
 * "Quizá también te interese" — puertas relacionadas al final de la
 * página. Lee door.relatedExperiences (Sanity, referencias a otras
 * puertas + nota corta) con fallback a los pares aprobados en
 * lib/doorCopy.ts. Necesita `allDoors` (ya cargado por la page.tsx)
 * para resolver nombre/imagen/slug de la puerta referenciada.
 */
export default function DoorRelatedExperiences({ door, allDoors }: { door: Door; allDoors: Door[] }) {
  const copy = DOOR_PAGE_COPY[door.id as "empresas" | "eventos"];
  const related =
    door.relatedExperiences && door.relatedExperiences.length > 0
      ? door.relatedExperiences
      : copy.related.map((r) => ({ door: r.doorId, note: r.note }));

  const resolved = related
    .map((item) => ({ target: allDoors.find((d) => d.id === item.door), note: item.note }))
    .filter((item): item is { target: Door; note: string | undefined } => Boolean(item.target));

  if (resolved.length === 0) return null;

  return (
    <section className="bg-surface py-16 sm:py-20">
      <Container>
        <span className="font-sans text-xs uppercase tracking-[0.25em] text-olive">Quizá también te interese</span>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          {resolved.map(({ target, note }, index) => (
            <AnimatedIn key={target.id} delay={index * 0.06}>
              <Link
                href={`/${target.slug}`}
                className="group flex items-center gap-4 overflow-hidden rounded-card bg-background p-4 transition-colors hover:bg-background/80 sm:p-5"
              >
                <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-card sm:h-20 sm:w-20">
                  <Image
                    src={target.selectorImage.url}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  {note ? <span className="block font-sans text-sm text-muted">{note}</span> : null}
                  <span className="mt-0.5 block font-serif text-lg text-text group-hover:text-olive-dark sm:text-xl">
                    {target.name}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="shrink-0 font-sans text-lg text-muted transition-transform duration-300 ease-out group-hover:translate-x-[3px] group-hover:text-olive"
                >
                  →
                </span>
              </Link>
            </AnimatedIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
