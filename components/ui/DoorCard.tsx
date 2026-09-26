import Image from "next/image";
import Link from "next/link";
import type { Door } from "@/types/content";
import DoorIcon from "@/components/ui/DoorIcon";

/**
 * Fila accionable del selector de 5 puertas de la home (V2) — NO son
 * cards verticales de foto completa. Cada fila: [mini imagen][01]
 * [icono][nombre][descripción][→], clicable en toda su superficie.
 * Las 5 se muestran siempre a la vez (nunca carrusel) — ver
 * components/sections/DoorSelectorSection.tsx.
 *
 * `description` es el texto corto específico de esta fila (dado por
 * el prompt V2 aprobado), distinto de door.eyebrow/shortDescription
 * (que siguen usándose en la propia página de la puerta).
 */
export default function DoorCard({ door, description }: { door: Door; description: string }) {
  return (
    <Link
      href={`/${door.slug}`}
      className="group flex items-center gap-4 border-b border-border py-6 transition-colors last:border-b-0 hover:border-olive/50 sm:gap-7 sm:py-8 lg:py-9"
    >
      <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-card bg-surface sm:h-24 sm:w-24 lg:h-28 lg:w-28">
        <Image
          src={door.selectorImage.url}
          alt=""
          fill
          sizes="112px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
          style={
            door.selectorImage.hotspot
              ? { objectPosition: `${door.selectorImage.hotspot.x}% ${door.selectorImage.hotspot.y}%` }
              : undefined
          }
        />
      </span>

      <span className="hidden font-serif text-base italic text-muted/80 transition-colors group-hover:text-olive sm:block sm:w-9">
        {String(door.order).padStart(2, "0")}
      </span>

      <DoorIcon name={door.icon} className="hidden h-6 w-6 shrink-0 text-olive/80 transition-colors group-hover:text-olive sm:block" />

      <span className="min-w-0 flex-1">
        <span className="block font-serif text-xl text-text transition-colors group-hover:text-olive-dark sm:text-[1.7rem]">
          {door.name}
        </span>
        <span className="mt-1 block truncate font-sans text-sm text-muted sm:whitespace-normal sm:text-base">{description}</span>
      </span>

      <span
        aria-hidden
        className="shrink-0 font-serif text-xl text-muted transition-transform duration-300 ease-out group-hover:translate-x-1.5 group-hover:text-olive"
      >
        →
      </span>
    </Link>
  );
}
