"use client";

import Link from "next/link";
import { useState } from "react";
import { VISIBLE_NAV_LINKS } from "@/lib/navigation";
import { cn } from "@/lib/utils";

/**
 * Menú móvil: hamburger fullscreen. Único trozo de cliente del
 * Header — el resto (logo, enlaces en escritorio) se sirve como
 * Server Component. "Experiencias" se despliega dentro del propio
 * menú fullscreen en vez de like un submenú flotante (no cabría bien
 * en móvil).
 *
 * `dark`: true cuando el header todavía está transparente sobre el
 * hero (icono blanco); false cuando ya tiene fondo sólido.
 */
export default function MobileNav({ dark = false }: { dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const [experienciasOpen, setExperienciasOpen] = useState(false);

  function close() {
    setOpen(false);
    setExperienciasOpen(false);
  }

  return (
    <div className="md:hidden">
      <button
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

      {open ? (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 overflow-y-auto bg-background py-20">
          <nav aria-label="Navegación principal">
            <ul className="flex flex-col items-center gap-6">
              {VISIBLE_NAV_LINKS.map((link) =>
                "children" in link && link.children ? (
                  <li key={link.label} className="flex flex-col items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setExperienciasOpen((v) => !v)}
                      aria-expanded={experienciasOpen}
                      className="flex items-center gap-2 font-serif text-3xl text-text transition-colors hover:text-olive"
                    >
                      {link.label}
                      <span aria-hidden className={cn("text-base transition-transform", experienciasOpen ? "rotate-180" : "")}>
                        ▾
                      </span>
                    </button>
                    {experienciasOpen ? (
                      <ul className="flex flex-col items-center gap-4">
                        {link.children.map((child) => (
                          <li key={child.url}>
                            <Link
                              href={child.url}
                              onClick={close}
                              className="font-sans text-lg text-muted transition-colors hover:text-olive-dark"
                            >
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
                      className="font-serif text-3xl text-text transition-colors hover:text-olive"
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
