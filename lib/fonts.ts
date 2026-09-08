import { Cormorant_Garamond, Manrope } from "next/font/google";

// Serif editorial para titulares (similar a Instrument Serif), sans
// limpia para interfaz/texto (similar a Inter/Manrope). Expuestas
// como variables CSS para poder cambiarlas fácilmente más adelante
// sin tocar el resto del código.
export const fontSerif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const fontSans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});
