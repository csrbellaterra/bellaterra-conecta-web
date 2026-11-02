"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { useHydratedReducedMotion } from "@/lib/useHydratedReducedMotion";

/**
 * Animación de entrada del hero al cargar la página (no al hacer
 * scroll, a diferencia de AnimatedIn — el hero ya está a la vista
 * desde el primer momento). Fundido + ligero desplazamiento vertical,
 * muy sutil, con `delay` para escalonar título/subtítulo/ubicación.
 * Respeta prefers-reduced-motion (aparece al instante) sin cambiar de
 * elemento entre servidor e hidratación (ver useHydratedReducedMotion).
 */
const variants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
  instant: { opacity: 1, y: 0, transition: { duration: 0 } },
};

export default function HeroReveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const shouldReduceMotion = useHydratedReducedMotion();

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      animate={shouldReduceMotion ? "instant" : "visible"}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
