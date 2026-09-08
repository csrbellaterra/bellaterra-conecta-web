"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Indicador de scroll animado en la esquina inferior del hero
 * ("Descubre la finca ↓"). Pequeño, aislado como cliente para no
 * forzar todo HeroSection a serlo.
 */
export default function ScrollCue({ label, href }: { label: string; href: string }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <a
      href={href}
      className="absolute bottom-8 right-5 z-10 flex items-center gap-2 font-sans text-xs uppercase tracking-[0.2em] text-white/80 transition-colors hover:text-white sm:right-8 lg:right-12"
    >
      {label}
      {!shouldReduceMotion ? (
        <motion.span
          aria-hidden
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          ↓
        </motion.span>
      ) : (
        <span aria-hidden>↓</span>
      )}
    </a>
  );
}
