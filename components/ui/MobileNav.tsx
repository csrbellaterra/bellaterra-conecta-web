"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { VISIBLE_NAV_LINKS } from "@/lib/navigation";
import { cn } from "@/lib/utils";

/**
 * Menú móvil (Fase 7A, sección 4): hamburger casi-fullscreen. Único
 * trozo de cliente del Header — el resto (logo, enlaces en
 * escritorio) se sirve como Server Component. "Experiencias" se
 * despliega dentro del propio menú fullscreen en vez de como un
 * submenú flotante (no cabría bien en móvil).
 *
 * Requisitos de la fase cumplidos aquí:
 *   - scroll del body bloqueado mientras el menú está abierto;
 *   - cierre con Escape, además del botón y de cada enlace;
 *   - foco devuelto al botón que abrió el menú al cerrarlo;
 *   - transición de apertura/cierre suave (fundido + desplazamiento
 *     mínimo, respeta prefers-reduced-motion vía useReducedMotion, el
 *     mismo patrón que AnimatedIn/HeroReveal — sin librerías nuevas).
 *
 * `dark`: true cuando el header todavía está transparente sobre el
 * hero (icono blanco); false cuando ya tiene fondo sólido.
 */
export default function MobileNav({ dark = false }: { dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const [experienciasOpen, setExperienciasOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  function close() {
    setOpen(false);
    setExperienciasOpen(false);
    triggerRef.current?.focus();
  }

  // Bloquea el scroll del body mientras el menú está abierto, y
  // permite cerrar con Escape desde cualquier punto del menú.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    document.addEventListener("keydown", onKeyDown);

    // Foco inicial dentro del panel para quien navega con teclado.
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive",
          open ? "text-text" : dark ? "text-white" : "text-text"
        )}
      >
        <span
          className={`block h-px w-6 bg-current transition-transform duration-300 ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
        />
        <span
          className={`block h-px w-6 bg-current transition-transform duration-300 ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navegación principal"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-background"
          >
            <div className="flex flex-1 flex-col items-center justify-center gap-10 px-6 py-24">
              <nav aria-label="Navegación principal">
                <ul className="flex flex-col items-center gap-8">
                  {VISIBLE_NAV_LINKS.map((link) =>
                    "children" in link && link.children ? (
                      <li key={link.label} className="flex flex-col items-center gap-6">
                        <button
                          type="button"
                          onClick={() => setExperienciasOpen((v) => !v)}
                          aria-expanded={experienciasOpen}
                          className="flex items-center gap-2 font-serif text-3xl text-text transition-colors hover:text-olive sm:text-4xl"
                        >
                          {link.label}
                          <span aria-hidden className={cn("text-base transition-transform", experienciasOpen ? "rotate-180" : "")}>
                            ▾
                          </span>
                        </button>
                        {experienciasOpen ? (
                          <ul className="flex flex-col items-center gap-5">
                            {link.children.map((child, index) => (
                              <li key={child.url}>
                                <Link
                                  href={child.url}
                                  onClick={close}
                                  className="flex items-baseline gap-3 font-sans text-lg text-muted transition-colors hover:text-olive-dark"
                                >
                                  <span aria-hidden className="font-sans text-xs tracking-[0.15em] text-muted/70">
                                    {String(index + 1).padStart(2, "0")}
                                  </span>
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </li>
                    ) : (
                      <li key={link.url}>
                        <Link
                          href={link.url}
                          onClick={close}
                          className="font-serif text-3xl text-text transition-colors hover:text-olive sm:text-4xl"
                        >
                          {link.label}
                        </Link>
                      </li>
                    )
                  )}
                </ul>
              </nav>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
