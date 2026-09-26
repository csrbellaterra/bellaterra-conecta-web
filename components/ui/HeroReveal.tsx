"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Animación de entrada del hero al cargar la página (no al hacer
 * scroll, a diferencia de AnimatedIn — el hero ya está a la vista
 * desde el primer momento). Fundido + ligero desplazamiento vertical,
 * muy sutil, con `delay` para escalonar título/subtítulo/ubicación.
 * Respeta prefers-reduced-motion.
 */
export default function HeroReveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
