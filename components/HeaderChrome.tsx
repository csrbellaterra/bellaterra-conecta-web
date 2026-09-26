"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { VISIBLE_NAV_LINKS } from "@/lib/navigation";
import MobileNav from "@/components/ui/MobileNav";
import ExperiencesDropdown from "@/components/ui/ExperiencesDropdown";
import type { SanityImage } from "@/types/content";

/**
 * Parte interactiva del Header (V2/Fase 7A): controla el cambio de
 * fondo al hacer scroll (transparente → crema ligeramente opaco,
 * fino y silencioso, nunca un navbar pesado) y delega el desplegable
 * "Experiencias" en escritorio a ExperiencesDropdown (cierra con
 * Escape, click fuera, y al navegar — ver ese componente). Header.tsx
 * (Server Component) sigue siendo quien resuelve el logo/título desde
 * Sanity — este componente solo se encarga de la interacción.
 */
export default function HeaderChrome({
  variant,
  logo,
  siteTitle,
}: {
  variant: "solid" | "transparent";
  logo?: SanityImage;
  siteTitle: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const isTransparent = variant === "transparent";

  useEffect(() => {
    if (!isTransparent) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isTransparent]);

  const showSolidChrome = !isTransparent || scrolled;

  return (
    <header
      className={cn(
        "inset-x-0 top-0 z-30 w-full transition-[background-color,box-shadow,color] duration-300",
        // Solo el hero a pantalla completa (variant="transparent") usa
        // posición fija con fondo que aparece al hacer scroll — fino y
        // silencioso: una sombra casi imperceptible, nunca un borde
        // duro. El resto de páginas (variant="solid") mantiene el
        // comportamiento original (sticky, siempre opaco).
        isTransparent
          ? cn(
              "fixed",
              showSolidChrome
                ? "bg-background/95 text-text shadow-[0_1px_0_0_rgba(32,29,23,0.08)] backdrop-blur-sm"
                : "bg-transparent text-white shadow-none"
            )
          : "sticky bg-background text-text shadow-[0_1px_0_0_rgba(32,29,23,0.08)]"
      )}
    >
      <div className="mx-auto flex w-full max-w-content items-center justify-between px-5 py-4 sm:px-8 sm:py-5 lg:px-12">
        <Link href="/" className="flex items-center gap-2" aria-label="Bellaterra Conecta — inicio">
          {logo ? (
            <Image
              src={logo.url}
              alt={logo.alt || siteTitle}
              width={400}
              height={289}
              className={cn("h-7 w-auto sm:h-8 transition-[filter] duration-300", !showSolidChrome ? "brightness-0 invert" : "")}
              priority
            />
          ) : null}
          <span className="font-serif text-base tracking-wide sm:text-lg">{siteTitle}</span>
        </Link>

        <nav aria-label="Navegación principal" className="hidden md:block">
          <ul className="flex items-center gap-9">
            {VISIBLE_NAV_LINKS.map((link) =>
              "children" in link && link.children ? (
                <ExperiencesDropdown key={link.label} label={link.label} items={link.children} showSolidChrome={showSolidChrome} />
              ) : (
                <li key={link.url}>
                  <Link
                    href={link.url}
                    className={cn(
                      "font-sans text-[13px] uppercase tracking-[0.12em] transition-colors",
                      showSolidChrome ? "text-muted hover:text-text" : "text-white/85 hover:text-white"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>

        <MobileNav dark={!showSolidChrome} />
      </div>
    </header>
  );
}
