import type { Metadata } from "next";
import { fontSans, fontSerif } from "@/lib/fonts";
import "./globals.css";

/**
 * Layout raíz. Deliberadamente NO incluye Header/Footer: cada
 * page.tsx los monta explícitamente (el Header necesita variar entre
 * "transparent" en la home y "solid" en el resto de páginas), y así
 * /studio (Sanity Studio) tampoco hereda ninguna cabecera del sitio.
 */
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Bellaterra Conecta — Una finca. Cinco formas de vivirla.",
    template: "%s — Bellaterra Conecta",
  },
  description:
    "Finca en Bellaterra, Barcelona, para empresas, eventos, estancias, comunidad y pickleball.",
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Bellaterra Conecta",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${fontSerif.variable} ${fontSans.variable}`}>
      <body className="bg-background font-sans text-text antialiased">{children}</body>
    </html>
  );
}
