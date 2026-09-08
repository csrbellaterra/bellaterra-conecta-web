import Image from "next/image";
import Link from "next/link";
import type { Door } from "@/types/content";

/**
 * Tarjeta de una puerta en el selector horizontal de 5 puertas de la
 * home. Las 5 se muestran siempre a la vez (grid, no carrusel) — ver
 * components/sections/DoorSelectorSection.tsx.
 */
export default function DoorCard({ door }: { door: Door }) {
  return (
    <Link
      href={`/${door.slug}`}
      className="group relative flex h-[420px] flex-col justify-end overflow-hidden rounded-card border border-border bg-surface transition-transform duration-500 ease-out hover:-translate-y-1 focus-visible:-translate-y-1 sm:h-[480px]"
    >
      <Image
        src={door.selectorImage.url}
        alt={door.selectorImage.alt}
        fill
        sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 100vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        style={
          door.selectorImage.hotspot
            ? { objectPosition: `${door.selectorImage.hotspot.x}% ${door.selectorImage.hotspot.y}%` }
            : undefined
        }
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
      <div className="relative z-10 flex flex-col gap-2 p-5 sm:p-6">
        <span className="font-sans text-xs tracking-[0.2em] text-white/70">
          {String(door.order).padStart(2, "0")}
        </span>
        <span className="font-serif text-2xl text-white sm:text-[1.75rem]">{door.name}</span>
        <span className="font-sans text-sm leading-snug text-white/80">{door.eyebrow}</span>
      </div>
    </Link>
  );
}
