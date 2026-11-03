"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import type { CinematicMotion } from "@/types/content";
import type { IntroScene, SceneReview } from "@/lib/cinematic";
import CinematicStatic from "./CinematicStatic";
import ScenePicture from "./ScenePicture";

export type CinematicIntroProps = {
  scenes: IntroScene[];
  eyebrow: string;
  headline: string;
  description?: string;
  ctaLabel: string;
  ctaHref: string;
  /** id del bloque al que salta «Saltar introducción» */
  skipTo: string;
};

// Peso de cada escena en el recorrido: la primera lleva además el titular de
// la puerta y la última se mantiene un poco antes de dar paso a la información.
const sceneWeight = (index: number, total: number) => (index === 0 ? 1.6 : index === total - 1 ? 1.25 : 1);
// Pantallas de scroll por unidad de peso (unas 4,5 en total con cuatro
// escenas), con un máximo para que cinco escenas no alarguen el recorrido.
const SCREENS_PER_WEIGHT = 0.92;
const MAX_SCREENS = 4.8;
const CROSSFADE = 0.05;
// Las dos primeras fotos se piden de entrada; el resto, cuando la página ha
// terminado de cargar (en segundo plano) o, si se adelanta el scroll, un poco
// antes de que empiece su fundido.
const PRELOAD_AHEAD = 0.3;
const PRELOAD_DELAY_MS = 600;

/**
 * Introducción cinematográfica de las páginas de experiencia (bloque A).
 * Motor común a las cuatro puertas, a partir del prototipo /experimento-scroll:
 * un contenedor alto con un escenario `sticky` de 100svh; el progreso del
 * scroll (0–1), suavizado con un muelle corto, se reparte entre las escenas.
 *
 * Cada escena es una fotografía real con un movimiento de cámara simulado
 * (acercarse, alejarse o desplazarse dentro del encuadre) y un fundido
 * cruzado con la siguiente. Todo depende solo de la posición del scroll, así
 * que retroceder rebobina exactamente. «Saltar introducción» está siempre
 * visible. Con prefers-reduced-motion, ahorro de datos o un dispositivo muy
 * modesto se muestra CinematicStatic: las mismas escenas como fotos fijas.
 */
export default function CinematicIntro(props: CinematicIntroProps) {
  const reduceMotion = useReducedMotion();
  const [staticMode, setStaticMode] = useState(false);

  useEffect(() => {
    const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
    const lowEnd = (nav.hardwareConcurrency ?? 8) <= 2 || (nav.deviceMemory ?? 8) <= 2;
    setStaticMode(!!reduceMotion || !!nav.connection?.saveData || lowEnd);
  }, [reduceMotion]);

  if (staticMode) return <CinematicStatic {...props} />;
  return <Film {...props} />;
}

function Film({ scenes, eyebrow, headline, description, ctaLabel, ctaHref, skipTo }: CinematicIntroProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  // Muelle corto: absorbe los saltos de la rueda sin sensación de retraso.
  const p = useSpring(scrollYProgress, { stiffness: 220, damping: 40, mass: 0.4, restDelta: 0.0002 });

  const weights = scenes.map((_, i) => sceneWeight(i, scenes.length));
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const bounds = weights.reduce<[number, number][]>((acc, w) => {
    const start = acc.length ? acc[acc.length - 1][1] : 0;
    return [...acc, [start, start + w / totalWeight]];
  }, []);
  const last = scenes.length - 1;
  const [firstStart, firstEnd] = bounds[0];

  const [pageLoaded, setPageLoaded] = useState(false);
  useEffect(() => {
    let timer: number | undefined;
    const ready = () => (timer = window.setTimeout(() => setPageLoaded(true), PRELOAD_DELAY_MS));
    if (document.readyState === "complete") ready();
    else window.addEventListener("load", ready, { once: true });
    return () => {
      window.removeEventListener("load", ready);
      window.clearTimeout(timer);
    };
  }, []);
  const firstLength = firstEnd - firstStart;

  return (
    <section aria-label="Introducción" data-header-overlay>
      <div ref={trackRef} className="relative" style={{ height: `calc(${(Math.min(totalWeight * SCREENS_PER_WEIGHT, MAX_SCREENS) * 100).toFixed(1)}svh + 100svh)` }}>
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-ink">
          {scenes.map((scene, i) => (
            <SceneLayer key={scene.image.url} scene={scene} index={i} bounds={bounds[i]} p={p} preload={pageLoaded} />
          ))}

          {/* Velos de legibilidad: arriba para la navegación, abajo para los textos. */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/50 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />

          {/* Apertura: la puerta y su propuesta. */}
          <Caption p={p} range={[-1, 0, firstStart + firstLength * 0.3, firstStart + firstLength * 0.42]}>
            <p className="mb-5 font-sans text-xs uppercase tracking-[0.3em] text-white/80">{eyebrow}</p>
            <h1 className="max-w-4xl whitespace-pre-line font-serif text-[2.6rem] leading-[1.05] text-white sm:text-6xl lg:text-7xl">
              {headline}
            </h1>
            {description ? (
              <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-white/85 sm:text-lg">{description}</p>
            ) : null}
          </Caption>

          {scenes.map((scene, i) => {
            const [start, end] = bounds[i];
            const length = end - start;
            const from = i === 0 ? start + length * 0.5 : start + length * 0.18;
            const range: [number, number, number, number] =
              i === last ? [from, from + length * 0.14, 2, 3] : [from, from + length * 0.14, end - length * 0.12, end - length * 0.02];
            return (
              <Caption key={scene.image.url} p={p} range={range} className={scene.framed?.desktop ? "scene-caption-framed" : undefined}>
                {scene.eyebrow ? (
                  <p className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-white/80">{scene.eyebrow}</p>
                ) : null}
                <p className="max-w-3xl font-serif text-[2rem] leading-[1.12] text-white sm:text-5xl lg:text-[3.4rem]">{scene.title}</p>
                {scene.body ? <p className="mt-5 max-w-lg font-sans text-base text-white/85 sm:text-lg">{scene.body}</p> : null}
                {i === last ? (
                  <Link
                    href={ctaHref}
                    className="pointer-events-auto mt-8 inline-flex w-fit items-center gap-2 rounded-pill bg-white px-7 py-3 font-sans text-sm font-medium tracking-wide text-ink transition-colors hover:bg-olive hover:text-white"
                  >
                    {ctaLabel} <span aria-hidden>→</span>
                  </Link>
                ) : null}
              </Caption>
            );
          })}

          <Progress p={p} bounds={bounds} />

          <div className="absolute bottom-6 right-5 flex items-center gap-6 sm:right-8 lg:right-12">
            <ScrollCue p={p} />
            <a
              href={`#${skipTo}`}
              onClick={(event) => {
                // Salto directo (sin el scroll suave global, que reproduciría toda la introducción).
                const target = document.getElementById(skipTo);
                if (!target) return;
                event.preventDefault();
                target.scrollIntoView({ behavior: "instant" as ScrollBehavior });
                target.focus({ preventScroll: true });
              }}
              className="font-sans text-[11px] uppercase tracking-[0.25em] text-white/80 underline decoration-white/30 underline-offset-[6px] transition-colors hover:text-white hover:decoration-white"
            >
              Saltar introducción
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Movimiento de cámara simulado, siempre leve: recorrer la finca, no hacer
 * zoom. La escala no pasa de 1,035 y los desplazamientos (1,4 %) caben en el
 * margen que da esa escala, así que nunca asoma el borde de la foto.
 */
const MOTIONS: Record<CinematicMotion, { scale: [number, number]; x: [string, string]; y: [string, string] }> = {
  pushIn: { scale: [1, 1.035], x: ["0%", "0%"], y: ["0%", "0%"] },
  pullOut: { scale: [1.035, 1], x: ["0%", "0%"], y: ["0%", "0%"] },
  driftRight: { scale: [1.035, 1.035], x: ["1.4%", "-1.4%"], y: ["0%", "0%"] },
  driftLeft: { scale: [1.035, 1.035], x: ["-1.4%", "1.4%"], y: ["0%", "0%"] },
  panUp: { scale: [1.035, 1.035], x: ["0%", "0%"], y: ["-1.4%", "1.4%"] },
  panDown: { scale: [1.035, 1.035], x: ["0%", "0%"], y: ["1.4%", "-1.4%"] },
};

function SceneLayer({
  scene,
  index,
  bounds,
  p,
  preload,
}: {
  scene: IntroScene;
  index: number;
  bounds: [number, number];
  p: MotionValue<number>;
  preload: boolean;
}) {
  const [start, end] = bounds;
  const { scale: s, x: dx, y: dy } = MOTIONS[scene.motion];
  // La escena se mueve desde que empieza a aparecer hasta que termina de irse.
  const span: [number, number] = [Math.max(0, start - CROSSFADE), Math.min(1, end + CROSSFADE)];
  const scale = useTransform(p, span, s);
  const x = useTransform(p, span, dx);
  const y = useTransform(p, span, dy);
  // Las escenas se apilan: cada una entra con un fundido sobre la anterior.
  const opacity = useTransform(p, index === 0 ? [0, 1] : [start - CROSSFADE / 2, start + CROSSFADE / 2], index === 0 ? [1, 1] : [0, 1]);
  const [near, setNear] = useState(false);
  useMotionValueEvent(p, "change", (v) => {
    if (!near && v > start - PRELOAD_AHEAD) setNear(true);
  });
  const mounted = index <= 1 || preload || near;

  return (
    <motion.div className="absolute inset-0 bg-ink will-change-[opacity]" style={{ opacity }}>
      {mounted ? (
        <motion.div className="absolute inset-0 will-change-transform" style={{ scale, x, y }}>
          <ScenePicture scene={scene} priority={index === 0} />
        </motion.div>
      ) : null}
      {scene.review ? <ReviewBadge review={scene.review} /> : null}
    </motion.div>
  );
}

function Caption({
  p,
  range,
  className,
  children,
}: {
  p: MotionValue<number>;
  range: [number, number, number, number];
  className?: string;
  children: ReactNode;
}) {
  const opacity = useTransform(p, range, [0, 1, 1, 0]);
  const y = useTransform(p, [range[0], range[1]], [18, 0]);
  return (
    <motion.div className="pointer-events-none absolute inset-x-0 bottom-[17svh] sm:bottom-[15svh]" style={{ opacity, y }}>
      <div className="mx-auto w-full max-w-content px-5 sm:px-8 lg:px-12">
        <div className={className}>{children}</div>
      </div>
    </motion.div>
  );
}

/** Una línea fina por escena en el borde inferior izquierdo. */
function Progress({ p, bounds }: { p: MotionValue<number>; bounds: [number, number][] }) {
  return (
    <div className="absolute bottom-7 left-5 flex gap-1.5 sm:left-8 lg:left-12" aria-hidden>
      {bounds.map(([start, end]) => (
        <ProgressSegment key={start} p={p} start={start} end={end} />
      ))}
    </div>
  );
}

function ProgressSegment({ p, start, end }: { p: MotionValue<number>; start: number; end: number }) {
  const scaleX = useTransform(p, [start, end], [0, 1]);
  return (
    <span className="relative block h-px w-7 overflow-hidden bg-white/25 sm:w-10">
      <motion.span className="absolute inset-0 origin-left bg-white/85" style={{ scaleX }} />
    </span>
  );
}

function ScrollCue({ p }: { p: MotionValue<number> }) {
  const opacity = useTransform(p, [0, 0.04], [1, 0]);
  return (
    <motion.span
      className="pointer-events-none hidden items-center gap-3 font-sans text-[11px] uppercase tracking-[0.28em] text-white/70 sm:flex"
      style={{ opacity }}
      aria-hidden
    >
      Desliza
      <span className="block h-8 w-px bg-white/50" />
    </motion.span>
  );
}

/** Solo en `next dev`: la escena espera autorización de las personas o validación del espacio. */
export function ReviewBadge({ review }: { review: SceneReview }) {
  if (process.env.NODE_ENV !== "development") return null;
  return (
    <span className="absolute right-5 top-24 z-10 rounded-pill bg-amber-300/90 px-3 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-ink sm:right-8 lg:right-12">
      {review === "consent" ? "Pendiente de autorización" : "Provisional · pendiente de validación"}
    </span>
  );
}
