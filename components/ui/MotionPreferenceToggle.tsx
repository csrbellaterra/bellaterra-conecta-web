"use client";

import { useEffect, useState } from "react";
import { isHeroMotionPaused, MOTION_PREFERENCE_EVENT, setHeroMotionPaused } from "@/lib/motionPreference";

/**
 * Opción de accesibilidad del pie de página: detener o reanudar el vídeo
 * de fondo de la Home. Sustituye al antiguo botón flotante del hero.
 */
export default function MotionPreferenceToggle() {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setPaused(isHeroMotionPaused());
    const onChange = (e: Event) => setPaused((e as CustomEvent<boolean>).detail);
    window.addEventListener(MOTION_PREFERENCE_EVENT, onChange);
    return () => window.removeEventListener(MOTION_PREFERENCE_EVENT, onChange);
  }, []);

  return (
    <button
      type="button"
      onClick={() => setHeroMotionPaused(!paused)}
      aria-pressed={paused}
      className="font-sans text-xs text-muted transition-colors hover:text-text"
    >
      {paused ? "Reanudar vídeo de portada" : "Detener vídeo de portada"}
    </button>
  );
}
