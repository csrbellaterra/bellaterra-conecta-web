"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Retraso antes de cerrar tras salir del trigger/dropdown con el ratón — evita parpadeos al cruzar el pequeño hueco entre ambos. */
const CLOSE_DELAY_MS = 150;

/**
 * Desplegable "Experiencias" del header de escritorio (Fase 7A,
 * secciones 3 y corrección posterior). Lista sencilla y elegante,
 * numerada (01 Empresas … 05 Pickleball) — nunca un mega-menu.
 *
 * Se abre con click (siempre) y, además, con hover — pero SOLO en
 * dispositivos que de verdad soportan hover con puntero fino
 * (`(hover: hover) and (pointer: fine)`, comprobado con
 * `matchMedia`, no con CSS `:hover` a ciegas): en touch, el hover no
 * hace nada y solo funciona el click/tap, tal como se pidió.
 *
 * Cierra: al pulsar Escape, al hacer click fuera, al navegar
 * (cualquier click en un enlace), al perder el foco por completo
 * (Tab hacia fuera), y — solo en modo hover — al salir del trigger Y
 * del propio desplegable, con un pequeño retraso (150ms) para que
 * cruzar el hueco entre ambos con el ratón no lo cierre de golpe.
 *
 * mouseenter/mouseleave se escuchan en el <li> que envuelve trigger +
 * desplegable: como el panel es un descendiente del <li> (aunque esté
 * posicionado en absoluto fuera de su caja), moverse del botón al
 * panel no dispara mouseleave — solo lo dispara salir de verdad hacia
 * otro elemento de la página, que es cuando programamos el cierre con
 * retraso.
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
  const [hoverCapable, setHoverCapable] = useState(false);
  const containerRef = useRef<HTMLLIElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Detecta soporte real de hover + puntero fino (no táctil), y se
  // mantiene al día si el dispositivo cambia de modo (ej. tablet con
  // ratón conectado/desconectado).
  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    setHoverCapable(query.matches);
    const onChange = (event: MediaQueryListEvent) => setHoverCapable(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

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

  // Limpieza del temporizador de cierre pendiente si el componente se
  // desmonta (ej. al navegar) con el cierre todavía en curso.
  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  function cancelScheduledClose() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function handleMouseEnter() {
    if (!hoverCapable) return;
    cancelScheduledClose();
    setOpen(true);
  }

  function handleMouseLeave() {
    if (!hoverCapable) return;
    cancelScheduledClose();
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  }

  function handleBlur(event: React.FocusEvent<HTMLLIElement>) {
    if (!containerRef.current?.contains(event.relatedTarget as Node)) setOpen(false);
  }

  return (
    <li
      ref={containerRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onBlur={handleBlur}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onFocus={() => setOpen(true)}
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
