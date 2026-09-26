import { getSiteSettings } from "@/lib/content";
import HeaderChrome from "@/components/HeaderChrome";

/**
 * Cabecera compartida por toda la web (Server Component: resuelve
 * logo/título desde Sanity). La interacción (scroll, desplegable
 * "Experiencias", menú móvil) vive en HeaderChrome (cliente).
 *
 * variant="transparent": para el hero a pantalla completa de la home
 * (texto blanco sobre la foto; fondo crema ligeramente opaco al hacer
 * scroll). variant="solid": para el resto de páginas (fondo claro,
 * texto oscuro, siempre visible). El color real lo decide cada
 * page.tsx al montar <Header variant="..." />.
 */
export default async function Header({ variant = "solid" }: { variant?: "solid" | "transparent" }) {
  const settings = await getSiteSettings();

  return <HeaderChrome variant={variant} logo={settings.logo} siteTitle={settings.siteTitle} />;
}
