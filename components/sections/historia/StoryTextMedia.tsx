"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { MediaField } from "@/types/content";
import Container from "@/components/ui/Container";
import Media from "@/components/ui/Media";
import AnimatedIn from "@/components/ui/AnimatedIn";
import { cn } from "@/lib/utils";

/**
 * Bloque narrativo compartido de /nuestra-historia: texto editorial +
 * una fotografía grande, sin card blanca. Usado por "De dónde
 * venimos" y "Hacia dónde vamos" (con lados opuestos). Animación más
 * lenta y contemplativa que las páginas de puerta (fade + reveal más
 * suave); `parallax` añade un desplazamiento vertical muy sutil de la
 * imagen al hacer scroll, desactivado por completo si el usuario tiene
 * prefers-reduced-motion activado.
 */
export default function StoryTextMedia({
  eyebrow,
  title,
  body,
  media,
  imageSide = "right",
  parallax = false,
}: {
  eyebrow?: string;
  title?: string;
  body: string;
  media?: MediaField;
  imageSide?: "left" | "right";
  parallax?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], parallax && !shouldReduceMotion ? ["-4%", "4%"] : ["0%", "0%"]);

  return (
    <section className="bg-background py-20 sm:py-28 lg:py-32">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <AnimatedIn
            className={cn("flex flex-col gap-4", imageSide === "left" ? "lg:order-2" : "lg:order-1")}
          >
            {eyebrow ? <span className="font-sans text-xs uppercase tracking-[0.25em] text-olive">{eyebrow}</span> : null}
            {title ? <h2 className="font-serif text-3xl leading-tight text-text sm:text-4xl">{title}</h2> : null}
            <p className="max-w-md font-sans text-base leading-relaxed text-muted sm:text-lg">{body}</p>
          </AnimatedIn>

          {media ? (
            <div
              ref={ref}
              className={cn(
                "relative aspect-[4/5] w-full overflow-hidden sm:aspect-[16/11] lg:h-[560px] lg:aspect-auto",
                imageSide === "left" ? "lg:order-1" : "lg:order-2"
              )}
            >
              <motion.div style={{ y }} className="absolute inset-[-4%]">
                <Media media={media} alt={title ?? ""} sizes="(min-width: 1024px) 55vw, 100vw" />
              </motion.div>
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
