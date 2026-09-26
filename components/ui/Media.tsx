import Image from "next/image";
import type { MediaField } from "@/types/content";
import { cn } from "@/lib/utils";

/**
 * Renderiza un campo de media (imagen, vídeo subido o vídeo externo)
 * de forma consistente en todas las secciones. Centraliza aquí la
 * lógica para que, cuando llegue el vídeo real (ej. de Higgsfield),
 * baste con rellenar el campo en Sanity — no hay que tocar cada
 * sección una por una.
 */
export default function Media({
  media,
  alt,
  fill = true,
  sizes = "100vw",
  priority = false,
  className,
}: {
  media: MediaField;
  alt?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const autoplay = media.autoplay ?? true;
  const loop = media.loop ?? true;

  if ((media.type === "video" && media.videoUrl) || (media.type === "externalVideo" && media.externalVideoUrl)) {
    const desktopSrc = media.type === "video" ? media.videoUrl! : media.externalVideoUrl!;
    const mobileSrc = media.mobileVideoUrl;

    if (mobileSrc && mobileSrc !== desktopSrc) {
      return (
        <>
          <video
            className={cn("h-full w-full object-cover sm:hidden", className)}
            src={mobileSrc}
            poster={media.poster?.url}
            autoPlay={autoplay}
            muted
            loop={loop}
            playsInline
          />
          <video
            className={cn("hidden h-full w-full object-cover sm:block", className)}
            src={desktopSrc}
            poster={media.poster?.url}
            autoPlay={autoplay}
            muted
            loop={loop}
            playsInline
          />
        </>
      );
    }

    return (
      <video
        className={cn("h-full w-full object-cover", className)}
        src={desktopSrc}
        poster={media.poster?.url}
        autoPlay={autoplay}
        muted
        loop={loop}
        playsInline
      />
    );
  }

  if (!media.image) return null;

  if (media.mobileImage) {
    return (
      <>
        <Image
          src={media.mobileImage.url}
          alt={alt ?? media.mobileImage.alt}
          fill={fill}
          sizes={sizes}
          priority={priority}
          className={cn("object-cover sm:hidden", className)}
          style={
            media.mobileImage.hotspot
              ? { objectPosition: `${media.mobileImage.hotspot.x}% ${media.mobileImage.hotspot.y}%` }
              : undefined
          }
        />
        <Image
          src={media.image.url}
          alt={alt ?? media.image.alt}
          fill={fill}
          sizes={sizes}
          priority={priority}
          className={cn("hidden object-cover sm:block", className)}
          style={
            media.image.hotspot
              ? { objectPosition: `${media.image.hotspot.x}% ${media.image.hotspot.y}%` }
              : undefined
          }
        />
      </>
    );
  }

  return (
    <Image
      src={media.image.url}
      alt={alt ?? media.image.alt}
      fill={fill}
      sizes={sizes}
      priority={priority}
      className={cn("object-cover", className)}
      style={
        media.image.hotspot
          ? { objectPosition: `${media.image.hotspot.x}% ${media.image.hotspot.y}%` }
          : undefined
      }
    />
  );
}
