import type { CinematicMotion, SanityImage } from "@/types/content";

/**
 * Tipos y constantes de la introducción cinematográfica que comparten el
 * servidor y los componentes cliente (sin arrastrar al navegador la
 * configuración de las puertas de lib/doorExperience.ts).
 */

/** Recorte vertical de las escenas: móviles y tablets en vertical. */
export const PORTRAIT_MEDIA = "(max-width: 767px), (max-aspect-ratio: 4/5)";

/** Revisión pendiente de una escena (CLAUDE.md: imágenes). */
export type SceneReview =
  /** personas reconocibles sin autorización confirmada: solo en `next dev` */
  | "consent"
  /** foto provisional pendiente de validar que el espacio sigue igual: se publica, con aviso en `next dev` */
  | "validation";

/** Escena ya resuelta para el componente de la introducción. */
export type IntroScene = {
  image: SanityImage;
  mobileImage?: SanityImage;
  /**
   * srcset de derivados estáticos ya generados (public/images/experiencias):
   * se sirven tal cual, sin pasar por el optimizador de Next, que en frío
   * tarda segundos en generar la primera foto a pantalla completa.
   */
  srcSet?: { desktop: string; mobile?: string };
  /** Miniatura inline difuminada que se pinta al instante (solo la portada). */
  placeholder?: { desktop: string; mobile?: string };
  /** Encuadre en escritorio (object-position), p. ej. "50% 60%". */
  focus?: string;
  /**
   * Composición enmarcada en lugar de foto a sangre (ver app/globals.css):
   * en escritorio, fotos verticales; en móvil, espacios horizontales que a
   * pantalla completa perderían casi todo el ancho.
   */
  framed?: { desktop?: boolean; mobile?: boolean };
  eyebrow?: string;
  title: string;
  body?: string;
  motion: CinematicMotion;
  review?: SceneReview;
};
