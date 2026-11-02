import { getImageProps } from "next/image";
import type { HeroBlock, MediaField, SanityImage } from "@/types/content";
import HeroReveal from "@/components/ui/HeroReveal";
import HeroBackgroundVideo, { type HeroVideoSources } from "./HeroBackgroundVideo";
import { HOME_V2_COPY, v2Copy } from "@/lib/homeCopy";

/**
 * Hero de la Home V2: vídeo cinematográfico de fondo (no controlado
 * por scroll) sobre un póster de alta calidad.
 *
 * Fuente: homePage.hero (Sanity). Cuando hero.media sea un vídeo
 * (subido o externo), se reproduce con su vídeo móvil y su póster.
 * Mientras no exista el vídeo definitivo (ver
 * docs/fase-cinematica/STORYBOARD_VIDEO_HOME.md) se usa como póster
 * una fotografía real aprobada (plano 01 del storyboard), salvo que en
 * Sanity se haya puesto una imagen nueva distinta del fotograma de dron
 * heredado.
 */

// Fotograma de dron de baja resolución que la V2 sustituye.
const LEGACY_HERO_IMAGE_ASSET = "8327649d9148c8ca2704ad5eedf89ea813e5f61a";

const hotspotPosition = (image: SanityImage) => (image.hotspot ? `${image.hotspot.x}% ${image.hotspot.y}%` : "50% 50%");

const PROVISIONAL_POSTER: { desktop: SanityImage; mobile: SanityImage } = {
  desktop: {
    url: "/images/home/hero-provisional.jpg",
    alt: "Acceso a la casa principal de Bellaterra Conecta entre jardín y árboles",
    width: 2400,
    height: 1600,
  },
  mobile: {
    url: "/images/home/hero-provisional-mobile.jpg",
    alt: "Acceso a la casa principal de Bellaterra Conecta entre jardín y árboles",
    width: 1200,
    height: 1500,
  },
};

/**
 * Fuentes del vídeo de fondo. Sanity manda: un vídeo subido o externo en
 * hero.media (con sus versiones AV1 y móvil opcionales). Si hero.media no
 * es un vídeo, HOME_HERO_VIDEO_BASE_URL (variable de entorno, solo
 * servidor) apunta a una carpeta con los archivos definitivos del
 * montaje: en local /videos/home (public/videos/, fuera de git); en
 * Vercel, la URL del almacenamiento externo. Sin ninguna de las dos, solo
 * se ve el póster. Ver docs/fase-cinematica/VIDEO_HOME_INTEGRACION.md.
 */
function heroVideoSources(media: MediaField): HeroVideoSources | null {
  if (media.type === "video" && media.videoUrl) {
    return {
      desktop: { h264: media.videoUrl },
      mobile: media.mobileVideoUrl ? { h264: media.mobileVideoUrl } : undefined,
      mobileFit: media.mobileVideoFit,
    };
  }
  if (media.type === "externalVideo" && (media.externalVideoUrl || media.externalVideoUrlAv1)) {
    return {
      desktop: { av1: media.externalVideoUrlAv1, h264: media.externalVideoUrl },
      mobile: { av1: media.mobileExternalVideoUrlAv1, h264: media.mobileExternalVideoUrl ?? media.mobileVideoUrl },
      mobileFit: media.mobileVideoFit,
    };
  }
  const base = process.env.HOME_HERO_VIDEO_BASE_URL?.replace(/\/$/, "");
  if (!base) return null;
  return {
    desktop: { av1: `${base}/home_web_1920x1080_av1.mp4`, h264: `${base}/home_web_1920x1080_h264.mp4` },
    mobile: { av1: `${base}/home_web_movil_1080x1920_av1.mp4`, h264: `${base}/home_web_movil_1080x1920_h264.mp4` },
    // La versión móvil v3 lleva su ventana 4:3 y sus bandas tinta: se ve entera.
    mobileFit: "contain",
  };
}

/** Una línea por frase o, si es una sola frase, corte tras la primera coma ("Una finca, / diferentes…"). */
function splitTitleLines(title: string): string[] {
  const parts = title.split(". ").map((p) => p.trim()).filter(Boolean);
  if (parts.length > 1) return parts.map((part, i) => (i < parts.length - 1 && !part.endsWith(".") ? `${part}.` : part));
  const comma = title.indexOf(", ");
  return comma > 0 ? [title.slice(0, comma + 1), title.slice(comma + 2)] : [title];
}

export default function HomeHero({ block }: { block: HeroBlock }) {
  const media = block.media;
  const title = v2Copy(block.title, HOME_V2_COPY.heroTitle);
  const ctaLabel = v2Copy(block.ctaLabel, HOME_V2_COPY.heroCtaLabel);
  const ctaUrl = v2Copy(block.ctaUrl, HOME_V2_COPY.heroCtaUrl);

  const isVideo = media.type === "video" || media.type === "externalVideo";
  const videoSources = heroVideoSources(media);
  const sanityStill = isVideo ? media.poster : media.image;
  const useSanityStill = !!sanityStill && !sanityStill.url.includes(LEGACY_HERO_IMAGE_ASSET);
  const poster = useSanityStill ? sanityStill! : PROVISIONAL_POSTER.desktop;
  const mobilePoster = useSanityStill ? media.mobileImage ?? sanityStill! : PROVISIONAL_POSTER.mobile;
  // Sin "priority": Next añadiría un preload de cada póster y el escritorio volvería a bajar los dos.
  const common = { fill: true, loading: "eager", fetchPriority: "high", sizes: "100vw" } as const;
  const { props: desktopImg } = getImageProps({ ...common, src: poster.url, alt: poster.alt });
  const { props: mobileImg } = getImageProps({ ...common, src: mobilePoster.url, alt: mobilePoster.alt });

  return (
    <section className="relative flex h-[100svh] min-h-[560px] w-full items-end overflow-hidden bg-ink">
      <div className="absolute inset-0">
        {/* Un solo póster por pantalla (<picture>): el móvil y el de escritorio
            ya no se descargan los dos. */}
        <picture>
          <source media="(min-width: 640px)" srcSet={desktopImg.srcSet} sizes={desktopImg.sizes} />
          <img
            {...mobileImg}
            alt={mobilePoster.alt}
            className="object-cover [object-position:var(--poster-pos-m)] sm:[object-position:var(--poster-pos-d)]"
            style={{ ...mobileImg.style, ["--poster-pos-m" as string]: hotspotPosition(mobilePoster), ["--poster-pos-d" as string]: hotspotPosition(poster) }}
          />
        </picture>
        {videoSources ? <HeroBackgroundVideo sources={videoSources} /> : null}
        {/* Velos de legibilidad: arriba para la navegación, abajo a la
            izquierda para titular y CTA (donde vive el texto). El centro y
            la derecha de la foto quedan prácticamente limpios. */}
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-ink/55 via-ink/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 via-45% to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_8%_80%,rgba(20,19,15,0.68),transparent_72%)]" />
      </div>

      <div className="relative z-10 w-full pb-28 pt-32 max-sm:[@media(max-height:720px)]:pb-20 sm:pb-32 lg:pb-36 [@media(min-width:640px)_and_(max-width:1199px)_and_(max-aspect-ratio:4/5)]:pb-16">
        <div className="mx-auto flex w-full max-w-content flex-col gap-6 max-sm:[@media(max-height:720px)]:gap-4 px-5 sm:px-8 lg:px-12">
          {block.location ? (
            <HeroReveal delay={0}>
              <span className="font-sans text-xs uppercase tracking-[0.35em] text-white drop-shadow-[0_1px_10px_rgba(20,19,15,0.75)]">{block.location}</span>
            </HeroReveal>
          ) : null}

          <HeroReveal delay={0.1}>
            <h1 className="max-w-4xl font-serif text-[3.1rem] max-sm:[@media(max-height:720px)]:text-[2.6rem] leading-[1.04] text-white sm:text-7xl lg:max-w-5xl lg:text-[5rem] xl:text-[5.75rem] [@media(min-width:640px)_and_(max-width:1199px)_and_(max-aspect-ratio:4/5)]:text-6xl">
              {splitTitleLines(title).map((line, i) => (
                <span key={i} className="block drop-shadow-[0_2px_18px_rgba(20,19,15,0.5)]">
                  {line}
                </span>
              ))}
            </h1>
          </HeroReveal>

          <HeroReveal delay={0.22}>
            <a
              href={ctaUrl}
              className="btn-secondary mt-2 border-white/70 bg-ink/25 backdrop-blur-[2px] hover:border-white"
            >
              {ctaLabel} <span aria-hidden>↓</span>
            </a>
          </HeroReveal>
        </div>
      </div>
    </section>
  );
}
