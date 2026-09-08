import Image from "next/image";
import Link from "next/link";
import { getSiteSettings } from "@/lib/content";
import { cn } from "@/lib/utils";
import Container from "@/components/ui/Container";
import MobileNav from "@/components/ui/MobileNav";

/**
 * Cabecera compartida por toda la web.
 *
 * variant="transparent": para el hero a pantalla completa de la home
 * (texto blanco sobre la foto, sin fondo). variant="solid": para el
 * resto de páginas (fondo claro, texto oscuro). El color real lo
 * decide cada page.tsx al montar <Header variant="..." />.
 */
export default async function Header({ variant = "solid" }: { variant?: "solid" | "transparent" }) {
  const settings = await getSiteSettings();
  const isTransparent = variant === "transparent";

  return (
    <header
      className={cn(
        "inset-x-0 top-0 z-30 w-full",
        isTransparent ? "absolute text-white" : "sticky border-b border-border bg-background text-text"
      )}
    >
      <Container className="flex items-center justify-between py-5 sm:py-6">
        <Link href="/" className="flex items-center gap-2" aria-label="Bellaterra Conecta — inicio">
          {settings.logo ? (
            <Image
              src={settings.logo.url}
              alt={settings.logo.alt || settings.siteTitle}
              width={400}
              height={289}
              className={cn("h-8 w-auto sm:h-9", isTransparent ? "brightness-0 invert" : "")}
              priority
            />
          ) : null}
          <span className="font-serif text-lg tracking-wide sm:text-xl">{settings.siteTitle}</span>
        </Link>

        <nav aria-label="Navegación principal" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {settings.navigation.map((link) => (
              <li key={link.url}>
                <Link
                  href={link.url}
                  className={cn(
                    "font-sans text-sm tracking-wide transition-colors",
                    isTransparent ? "text-white/85 hover:text-white" : "text-muted hover:text-text"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <MobileNav links={settings.navigation} />
      </Container>
    </header>
  );
}
