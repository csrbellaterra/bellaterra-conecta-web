"use client";

import Link from "next/link";
import { useState } from "react";
import type { NavLink } from "@/types/content";

/**
 * Menú móvil. Único trozo de cliente del Header — el resto (logo,
 * enlaces en escritorio) se sirve como Server Component.
 */
export default function MobileNav({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive"
      >
        <span
          className={`block h-px w-6 bg-current transition-transform duration-300 ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
        />
        <span
          className={`block h-px w-6 bg-current transition-transform duration-300 ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
        />
      </button>

      {open ? (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-background">
          <nav aria-label="Navegación principal">
            <ul className="flex flex-col items-center gap-6">
              {links.map((link) => (
                <li key={link.url}>
                  <Link
                    href={link.url}
                    onClick={() => setOpen(false)}
                    className="font-serif text-3xl text-text transition-colors hover:text-olive"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
