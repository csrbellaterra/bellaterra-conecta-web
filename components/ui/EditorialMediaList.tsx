"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { MediaField } from "@/types/content";
import Media from "@/components/ui/Media";
import { cn } from "@/lib/utils";

export type EditorialMediaListItem = {
  label: string;
  title: string;
  body?: string;
  media?: MediaField;
};

/**
 * Lista editorial numerada + una única fotografía grande, en la
 * dirección "Passalacqua / Mas Girbau" pedida en la micro-fase 3.1:
 * la finca se descubre, no se cataloga. Sustituye a los grids de
 * cards/masonry que se usaban antes para "Qué puedes celebrar",
 * "Qué puedes hacer aquí" (bloque REUNIRSE/CREAR/CONECTAR queda
 * aparte, ver DoorFeatureBlocks) y "Espacios".
 *
 * Desktop: columna izquierda con la lista (número, título,
 * descripción, líneas finas de separación — sin cajas, sin fondos
 * independientes, sin border-radius de card); columna derecha con
 * una fotografía grande que cambia con crossfade al hacer hover/focus
 * sobre cada fila. Mobile: no hay hover — cada fila se muestra
 * seguida de su propia fotografía, con ritmo editorial.
 *
 * Respeta prefers-reduced-motion: sin crossfade animado, cambio
 * directo de imagen.
 */
export default function EditorialMediaList({ items }: { items: EditorialMediaListItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const activeMedia = items[activeIndex]?.media;

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
      {/* Columna de la lista — visible siempre */}
      <ul className="flex flex-col">
        {items.map((item, index) => (
          <li key={item.label} className="border-t border-border first:border-t-0">
            <button
              type="button"
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              className={cn(
                "flex w-full flex-col gap-1.5 py-6 text-left transition-colors sm:py-7",
                "hover:text-olive-dark focus-visible:text-olive-dark focus-visible:outline-none",
                activeIndex === index ? "text-text" : "text-text/75"
              )}
            >
              <span className="font-sans text-xs tracking-[0.15em] text-olive">{item.label}</span>
              <span className="font-serif text-2xl sm:text-3xl">{item.title}</span>
              {item.body ? (
                <span className="max-w-sm font-sans text-sm leading-relaxed text-muted sm:text-base">{item.body}</span>
              ) : null}
            </button>

            {/* En mobile, cada fila lleva su propia fotografía debajo (sin hover) */}
            {item.media ? (
              <div className="relative mb-2 aspect-[4/3] w-full overflow-hidden lg:hidden">
                <Media media={item.media} alt={item.title} sizes="100vw" />
              </div>
            ) : null}
          </li>
        ))}
      </ul>

      {/* Columna de la fotografía grande — solo desktop, con crossfade */}
      <div className="relative hidden aspect-[4/5] w-full overflow-hidden lg:block">
        {shouldReduceMotion ? (
          activeMedia ? <Media media={activeMedia} alt={items[activeIndex]?.title} sizes="50vw" /> : null
        ) : (
          <AnimatePresence mode="wait">
            {activeMedia ? (
              <motion.div
                key={activeIndex}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <Media media={activeMedia} alt={items[activeIndex]?.title} sizes="50vw" />
              </motion.div>
            ) : null}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
