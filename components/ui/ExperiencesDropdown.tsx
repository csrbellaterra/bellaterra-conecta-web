"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Desplegable "Experiencias" del header de escritorio (Fase 7A,
 * sección 3). Sustituye al patrón CSS-only anterior (group-hover):
 * ese patrón no podía cerrar con Escape ni al hacer click fuera, y el
 * prompt de rediseño lo exige explícitamente. Lista sencilla y
 * elegante, numerada (01 Empresas … 05 Pickleball) — nunca un
 * mega-menu.
 *
 * Cierra: al pulsar Escape, al hacer click fuera del propio
 * desplegable, y al navegar (cualquier click en un enlace interno).
 * Accesible por teclado: el botón activador es un <button
 * aria-expanded>, el desplegable es una lista de enlaces reales
 * (Tab/Shift+Tab los recorre en orden del DOM sin necesidad de un
 * roving-tabindex).
 */
export default function ExperiencesDropdown({
  label,
  items,
  showSolidChrome,
}: {
  label: string;
  items: { label: string; url: string }[];
  showSolidChrome: boolean;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    function onClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onClickOutside);
    };
  }, [open]);

  return (
    <li ref={containerRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-1.5 font-sans text-[13px] uppercase tracking-[0.12em] transition-colors",
          showSolidChrome ? "text-muted hover:text-text" : "text-white/85 hover:text-white"
        )}
      >
        {label}
        <span aria-hidden className={cn("text-[0.6rem] transition-transform duration-200", open ? "rotate-180" : "")}>
          ▾
        </span>
      </button>

      <div
        className={cn(
          "absolute left-1/2 top-full z-40 -translate-x-1/2 pt-3 transition-[opacity,visibility] duration-200",
          open ? "visible opacity-100" : "invisible opacity-0"
        )}
      >
        <ul className="min-w-[220px] rounded-card border border-border bg-background py-2 text-text shadow-[0_16px_40px_-12px_rgba(20,19,15,0.18)]">
          {items.map((item, index) => (
            <li key={item.url}>
              <Link
                href={item.url}
                onClick={() => setOpen(false)}
                className="flex items-baseline gap-3 px-5 py-2.5 font-sans text-sm text-text/85 transition-colors hover:bg-surface hover:text-olive-dark"
              >
                <span aria-hidden className="font-sans text-xs tracking-[0.1em] text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
