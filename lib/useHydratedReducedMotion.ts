"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * prefers-reduced-motion sin romper la hidratación. En el servidor
 * useReducedMotion() es null y el HTML sale con el estado inicial de la
 * animación; en el navegador ya es true en el primer render, y cambiar ahí
 * de elemento o de props produce un HTML distinto al del servidor. Este hook
 * devuelve false durante la hidratación y el valor real justo después.
 */
export function useHydratedReducedMotion(): boolean {
  const reduce = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated && !!reduce;
}
