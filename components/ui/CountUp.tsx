"use client";

import { motion, useInView, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * Cifra animada que cuenta de 0 hasta `value` al entrar en pantalla.
 * Se usa SOLO en la página de impacto y SOLO cuando impactEnabled es
 * true en Sanity (ver app/impacto/page.tsx) — nunca debe recibir un
 * valor de ejemplo/placeholder.
 */
export default function CountUp({
  value,
  suffix = "",
  locale = "es-ES",
}: {
  value: number;
  suffix?: string;
  locale?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const shouldReduceMotion = useReducedMotion();
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 30, stiffness: 90 });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (isInView) motionValue.set(value);
  }, [isInView, motionValue, value]);

  useEffect(() => {
    // Con reduced motion, salta directamente al valor final en vez de
    // animar el conteo.
    if (shouldReduceMotion) {
      setDisplay(value.toLocaleString(locale));
      return;
    }
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplay(Math.round(latest).toLocaleString(locale));
    });
    return unsubscribe;
  }, [springValue, locale, shouldReduceMotion, value]);

  return (
    <motion.span ref={ref} aria-label={`${value.toLocaleString(locale)}${suffix}`}>
      {display}
      {suffix}
    </motion.span>
  );
}
