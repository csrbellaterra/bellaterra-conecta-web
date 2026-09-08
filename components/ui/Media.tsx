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
  if (media.type === "video" && media.videoUrl) {
    return (
      <video
        className={cn("h-full w-full object-cover", className)}
        src={media.videoUrl}
        poster={media.poster?.url}
        autoPlay
        muted
        loop
        playsInline
      />
    );
  }

  if (media.type === "externalVideo" && media.externalVideoUrl) {
    return (
      <video
        className={cn("h-full w-full object-cover", className)}
        src={media.externalVideoUrl}
        poster={media.poster?.url}
        autoPlay
        muted
        loop
        playsInline
      />
    );
  }

  if (!media.image) return null;

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
