"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { VISIBLE_NAV_LINKS } from "@/lib/navigation";
import MobileNav from "@/components/ui/MobileNav";
import type { SanityImage } from "@/types/content";

/**
 * Parte interactiva del Header (V2): controla el cambio de fondo al
 * hacer scroll (transparente → crema ligeramente opaco) y el
 * desplegable "Experiencias" en escritorio. Header.tsx (Server
 * Component) sigue siendo quien resuelve el logo/título desde
 * Sanity — este componente solo se encarga de la interacción.
 *
 * El desplegable de "Experiencias" se abre con CSS (group-hover /
 * group-focus-within), sin estado de React: funciona con ratón y con
 * teclado (Tab) sin JS adicional.
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
        "inset-x-0 top-0 z-30 w-full transition-colors duration-300",
        // Solo el hero a pantalla completa (variant="transparent") usa
        // posición fija con fondo que aparece al hacer scroll. El resto
        // de páginas (variant="solid") mantiene el comportamiento
        // original (sticky, siempre opaco) sin cambios de layout.
        isTransparent
          ? cn(
              "fixed",
              showSolidChrome
                ? "border-b border-border bg-background/95 text-text backdrop-blur-sm"
                : "border-b border-transparent bg-transparent text-white"
            )
          : "sticky border-b border-border bg-background text-text"
      )}
    >
      <div className="mx-auto flex w-full max-w-content items-center justify-between px-5 py-5 sm:px-8 sm:py-6 lg:px-12">
        <Link href="/" className="flex items-center gap-2" aria-label="Bellaterra Conecta — inicio">
          {logo ? (
            <Image
              src={logo.url}
              alt={logo.alt || siteTitle}
              width={400}
              height={289}
              className={cn("h-8 w-auto sm:h-9 transition-[filter] duration-300", !showSolidChrome ? "brightness-0 invert" : "")}
              priority
            />
          ) : null}
          <span className="font-serif text-lg tracking-wide sm:text-xl">{siteTitle}</span>
        </Link>

        <nav aria-label="Navegación principal" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {VISIBLE_NAV_LINKS.map((link) =>
              "children" in link && link.children ? (
                <li key={link.label} className="group relative">
                  <button
                    type="button"
                    className={cn(
                      "flex items-center gap-1 font-sans text-sm tracking-wide transition-colors",
                      showSolidChrome ? "text-muted hover:text-text" : "text-white/85 hover:text-white"
                    )}
                  >
                    {link.label}
                    <span aria-hidden className="text-[0.6rem] transition-transform duration-200 group-hover:rotate-180">
                      ▾
                    </span>
                  </button>

                  <div className="invisible absolute left-1/2 top-full z-40 -translate-x-1/2 pt-3 opacity-0 transition-[opacity,visibility] duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <ul className="min-w-[200px] rounded-card border border-border bg-background py-2 text-text shadow-[0_12px_30px_-10px_rgba(0,0,0,0.15)]">
                      {link.children.map((child) => (
                        <li key={child.url}>
                          <Link
                            href={child.url}
                            className="block px-5 py-2.5 font-sans text-sm text-text/85 transition-colors hover:bg-surface hover:text-olive-dark"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ) : (
                <li key={link.url}>
                  <Link
                    href={link.url}
                    className={cn(
                      "font-sans text-sm tracking-wide transition-colors",
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
