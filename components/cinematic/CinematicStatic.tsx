import Link from "next/link";
import { ReviewBadge, type CinematicIntroProps } from "./CinematicIntro";
import ScenePicture from "./ScenePicture";

function CtaLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="mt-8 inline-flex w-fit items-center gap-2 rounded-pill bg-white px-7 py-3 font-sans text-sm font-medium tracking-wide text-ink transition-colors hover:bg-olive hover:text-white"
    >
      {label} <span aria-hidden>→</span>
    </Link>
  );
}

/**
 * Versión sin movimiento de la introducción (prefers-reduced-motion, ahorro
 * de datos o dispositivos modestos): la apertura a pantalla completa y cada
 * escena como fotografía fija a sangre con su texto, en el mismo orden.
 */
export default function CinematicStatic({ scenes, eyebrow, headline, description, ctaLabel, ctaHref, skipTo }: CinematicIntroProps) {
  return (
    <section aria-label="Introducción" data-header-overlay>
      <div className="relative flex h-[100svh] min-h-[560px] items-end overflow-hidden bg-ink">
        <ScenePicture scene={scenes[0]} priority />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-ink/30" />
        <div className="relative mx-auto w-full max-w-content px-5 pb-[15svh] sm:px-8 lg:px-12">
          <p className="mb-5 font-sans text-xs uppercase tracking-[0.3em] text-white/80">{eyebrow}</p>
          <h1 className="max-w-4xl whitespace-pre-line font-serif text-[2.6rem] leading-[1.05] text-white sm:text-6xl lg:text-7xl">{headline}</h1>
          {description ? <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-white/85 sm:text-lg">{description}</p> : null}
          {/* La primera escena comparte foto con la apertura: su texto va aquí. */}
          <p className="mt-8 max-w-xl font-serif text-2xl italic leading-snug text-white/90">{scenes[0].title}</p>
          {scenes.length === 1 ? <CtaLink href={ctaHref} label={ctaLabel} /> : null}
        </div>
        {scenes[0].review ? <ReviewBadge review={scenes[0].review} /> : null}
        <a
          href={`#${skipTo}`}
          className="absolute bottom-6 right-5 font-sans text-[11px] uppercase tracking-[0.25em] text-white/80 underline decoration-white/30 underline-offset-[6px] hover:text-white sm:right-8 lg:right-12"
        >
          Saltar introducción
        </a>
      </div>

      {scenes.slice(1).map((scene, i, rest) => (
        <figure key={scene.image.url} className="relative flex h-[85svh] min-h-[480px] items-end overflow-hidden bg-ink">
          <ScenePicture scene={scene} />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent" />
          {scene.review ? <ReviewBadge review={scene.review} /> : null}
          <figcaption className="relative mx-auto w-full max-w-content px-5 pb-[10svh] sm:px-8 lg:px-12">
            {scene.eyebrow ? <p className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-white/80">{scene.eyebrow}</p> : null}
            <p className="max-w-3xl font-serif text-[2rem] leading-[1.12] text-white sm:text-5xl">{scene.title}</p>
            {scene.body ? <p className="mt-5 max-w-lg font-sans text-base text-white/85 sm:text-lg">{scene.body}</p> : null}
            {i === rest.length - 1 ? <CtaLink href={ctaHref} label={ctaLabel} /> : null}
          </figcaption>
        </figure>
      ))}
    </section>
  );
}
