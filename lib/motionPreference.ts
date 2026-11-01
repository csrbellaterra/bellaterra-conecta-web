/**
 * Preferencia del visitante para detener el vídeo de fondo de la Home.
 * Se guarda en este navegador y se cambia desde el pie de página
 * (MotionPreferenceToggle); el vídeo la escucha con un evento propio.
 * Es independiente de prefers-reduced-motion del sistema, que siempre
 * deja el póster sin vídeo.
 */
const KEY = "bc-hero-motion-paused";
export const MOTION_PREFERENCE_EVENT = "bc-hero-motion-change";

export function isHeroMotionPaused(): boolean {
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function setHeroMotionPaused(paused: boolean) {
  try {
    window.localStorage.setItem(KEY, paused ? "1" : "0");
  } catch {
    // Sin almacenamiento: la preferencia vale solo para esta visita.
  }
  window.dispatchEvent(new CustomEvent(MOTION_PREFERENCE_EVENT, { detail: paused }));
}
