"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { isHeroMotionPaused, MOTION_PREFERENCE_EVENT } from "@/lib/motionPreference";

/** Un mismo vídeo en sus dos códecs. AV1 es el principal; H.264, el respaldo universal. */
export type VideoPair = { av1?: string; h264?: string };

export type HeroVideoSources = {
  desktop: VideoPair;
  /** vídeo vertical para pantallas estrechas; si falta, se usa el de escritorio */
  mobile?: VideoPair;
  /** "contain": el vídeo móvil se ve entero sobre tinta (vídeos montados con bandas) */
  mobileFit?: "cover" | "contain";
};

// Códecs reales de los archivos de la Home: AV1 Main 10 bits nivel 4.0 y H.264 High 4.2.
const AV1_TYPE = 'video/mp4; codecs="av01.0.08M.10"';
// Móviles y también tablets en vertical: con el vídeo 16:9 en "cover" solo verían el 40 % del plano.
const MOBILE_QUERY = "(max-width: 767px), (max-width: 1199px) and (max-aspect-ratio: 4/5)";

const hasPair = (pair?: VideoPair) => !!pair && !!(pair.av1 || pair.h264);

/** AV1 solo si el navegador lo decodifica con fluidez (MediaCapabilities); si no, H.264. */
async function playsAv1Smoothly(width: number, height: number, bitrate: number) {
  if (!document.createElement("video").canPlayType(AV1_TYPE)) return false;
  if (!navigator.mediaCapabilities?.decodingInfo) return true;
  try {
    const info = await navigator.mediaCapabilities.decodingInfo({
      type: "file",
      video: { contentType: AV1_TYPE, width, height, bitrate, framerate: 24 },
    });
    return info.supported && info.smooth;
  } catch {
    return true;
  }
}

/**
 * Capa de vídeo del hero de la Home (cliente). El póster lo pinta el
 * servidor debajo (next/image, prioridad LCP); este componente solo
 * monta el <video> cuando tiene sentido:
 *
 * - nunca con prefers-reduced-motion ni con ahorro de datos
 *   (navigator.connection.saveData) — se queda el póster;
 * - tampoco si el visitante lo ha detenido desde el pie de página
 *   (lib/motionPreference): no se descarga hasta que lo reanude;
 * - elige UNA sola fuente antes de montar el <video>: la móvil por
 *   debajo de 768 px o en tablets en vertical y, dentro de ella, AV1 si se reproduce con fluidez
 *   o H.264 si no. El navegador nunca descarga los dos tamaños;
 * - si una fuente falla pasa a la siguiente, y si fallan todas se
 *   queda el póster (nunca un fondo negro);
 * - autoplay + muted + loop + playsInline, sin pista ni controles de
 *   sonido; aparece con un fundido cuando empieza a reproducirse;
 * - se pausa solo mientras el hero no está en pantalla y vuelve a
 *   reproducirse al regresar;
 * - en móvil con mobileFit "contain" el vídeo vertical se ve entero,
 *   anclado arriba, y el resto del hero se completa con tinta (el
 *   mismo color de sus bandas).
 */
export default function HeroBackgroundVideo({ sources }: { sources: HeroVideoSources }) {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [queue, setQueue] = useState<string[]>([]);
  const [contain, setContain] = useState(false);
  const [visible, setVisible] = useState(false);
  // null hasta leer la preferencia guardada: así no se descarga nada antes de saberla.
  const [userPaused, setUserPaused] = useState<boolean | null>(null);
  const [onScreen, setOnScreen] = useState(true);
  const { desktop, mobile, mobileFit } = sources;

  useEffect(() => {
    setUserPaused(isHeroMotionPaused());
    const onChange = (e: Event) => setUserPaused((e as CustomEvent<boolean>).detail);
    window.addEventListener(MOTION_PREFERENCE_EVENT, onChange);
    return () => window.removeEventListener(MOTION_PREFERENCE_EVENT, onChange);
  }, []);

  // Elige la fuente la primera vez que el vídeo puede reproducirse.
  const wantsVideo = userPaused === false && !reduceMotion;
  useEffect(() => {
    if (!wantsVideo || queue.length) return;
    let cancelled = false;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData) return;
    const isMobile = window.matchMedia(MOBILE_QUERY).matches && hasPair(mobile);
    const pair = isMobile ? mobile! : desktop;
    if (!hasPair(pair)) return;
    const [w, h, bitrate] = isMobile ? [1080, 1920, 3_000_000] : [1920, 1080, 7_600_000];
    playsAv1Smoothly(w, h, bitrate).then((av1) => {
      if (cancelled) return;
      const order = [av1 ? pair.av1 : undefined, pair.h264, av1 ? undefined : pair.av1].filter(Boolean) as string[];
      setContain(isMobile && mobileFit === "contain");
      setQueue(order);
    });
    return () => {
      cancelled = true;
    };
    // queue.length: solo se elige una vez; los fallos avanzan la cola sin volver a elegir.
  }, [wantsVideo, desktop, mobile, mobileFit]);

  const source = reduceMotion ? null : queue[0] ?? null;

  // Pausa mientras el hero no se ve (ahorra decodificación y batería al leer la página).
  useEffect(() => {
    const video = videoRef.current;
    if (!video || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    observer.observe(video);
    return () => observer.disconnect();
  }, [source]);

  const playing = !userPaused && onScreen;
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) video.play().catch(() => undefined);
    else video.pause();
  }, [playing, source]);

  if (!source) return null;

  return (
    <video
      key={source}
      ref={videoRef}
      className={cn(
        "absolute inset-0 h-full w-full transition-opacity duration-1000",
        // Vídeo vertical con ventana 4:3 (del 42,5 % al 117,5 % del ancho) y bandas tinta.
        // - Pantallas más alargadas que 9:16 (teléfonos): entero, anclado arriba. Si la pantalla
        //   es baja para la ventana más el titular (~400 px), sube hasta 21,5vw sobre su banda
        //   superior, sin meter la ventana bajo la navegación.
        // - Pantallas más anchas que 9:16 (tablets en vertical): llena el ancho y solo recorta
        //   bandas, con la ventana justo debajo de la navegación (88 px).
        contain
          ? "bg-ink object-contain [object-position:50%_clamp(-21.5vw,calc(100svh-117.5vw-400px),0px)] [@media(min-aspect-ratio:9/16)]:object-cover [@media(min-aspect-ratio:9/16)]:[object-position:50%_max(calc(100svh-177.8vw),calc(88px-37.5vw))]"
          : "object-cover",
        visible ? "opacity-100" : "opacity-0"
      )}
      src={source}
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      aria-hidden
      tabIndex={-1}
      onPlaying={() => setVisible(true)}
      onLoadedData={() => !playing && setVisible(true)}
      onError={() => {
        setVisible(false);
        setQueue((q) => q.slice(1));
      }}
    />
  );
}
