import Link from "next/link";
import type { IntroScene } from "@/lib/cinematic";
import ScenePicture from "./ScenePicture";
import { ReviewBadge } from "./CinematicIntro";

/**
 * Portada editorial del bloque A: una sola fotografía a sangre con la
 * propuesta de la puerta y su CTA, sin recorrido por scroll. La usan las
 * puertas que todavía no tienen escenas suficientes para la introducción
 * cinematográfica (p. ej. Comunidad mientras falten autorizaciones).
 */
export default function DoorCover({
  scene,
  eyebrow,
  headline,
  description,
  ctaLabel,
  ctaHref,
  skipTo,
}: {
  scene: IntroScene;
  eyebrow: string;
  headline: string;
  description?: string;
  ctaLabel: string;
  ctaHref: string;
  skipTo: string;
}) {
  return (
    <section aria-label="Introducción" data-header-overlay className="relative flex h-[100svh] min-h-[560px] items-end overflow-hidden bg-ink">
      <ScenePicture scene={scene} priority />
      {scene.review ? <ReviewBadge review={scene.review} /> : null}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-transparent" />
      <div className="relative mx-auto w-full max-w-content px-5 pb-[15svh] sm:px-8 lg:px-12">
        <p className="mb-5 font-sans text-xs uppercase tracking-[0.3em] text-white/80">{eyebrow}</p>
        <h1 className="max-w-4xl whitespace-pre-line font-serif text-[2.6rem] leading-[1.05] text-white sm:text-6xl lg:text-7xl">{headline}</h1>
        {description ? <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-white/85 sm:text-lg">{description}</p> : null}
        <Link
          href={ctaHref}
          className="mt-8 inline-flex w-fit items-center gap-2 rounded-pill bg-white px-7 py-3 font-sans text-sm font-medium tracking-wide text-ink transition-colors hover:bg-olive hover:text-white"
        >
          {ctaLabel} <span aria-hidden>→</span>
        </Link>
      </div>
      <a
        href={`#${skipTo}`}
        className="absolute bottom-6 right-5 font-sans text-[11px] uppercase tracking-[0.25em] text-white/80 underline decoration-white/30 underline-offset-[6px] hover:text-white sm:right-8 lg:right-12"
      >
        Descubrir más
      </a>
    </section>
  );
}
