"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

/**
 * Envoltorio de animación de entrada al hacer scroll. Es el único
 * sitio que importa `motion/react` para este patrón de "aparecer
 * suavemente" — así los Server Components (Hero, ImageText, etc.)
 * siguen siendo servidos en servidor y solo esta pequeña capa de
 * animación se convierte en cliente, cumpliendo el requisito de
 * "islas" de cliente aisladas para animación.
 *
 * Respeta prefers-reduced-motion: si el usuario lo tiene activado,
 * el contenido aparece sin desplazamiento ni fundido.
 */
const variants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function AnimatedIn({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "span";
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const motionProps = {
    className,
    initial: "hidden" as const,
    whileInView: "visible" as const,
    viewport: { once: true, margin: "-80px" },
    variants,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
  };

  if (as === "section") return <motion.section {...motionProps}>{children}</motion.section>;
  if (as === "span") return <motion.span {...motionProps}>{children}</motion.span>;
  return <motion.div {...motionProps}>{children}</motion.div>;
}
