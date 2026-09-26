import type { Media, MediaField } from "@/types/content";

/**
 * Adapta el objeto de media V2 (`Media` — usado en campos nuevos como
 * door.homeMedia, door.heroMobileMedia, event.media) a la forma que
 * espera <Media> (components/ui/Media.tsx), que históricamente solo
 * conocía `MediaField` (el objeto "mediaField" original de Sanity).
 *
 * Así <Media> puede seguir siendo un único componente para todo el
 * sitio sin tener que reescribir su lógica de imagen/vídeo/mobile/
 * poster dos veces.
 */
export function mediaFieldFromV2(media: Media): MediaField {
  return {
    type: media.mediaType === "uploadedVideo" ? "video" : media.mediaType === "externalVideo" ? "externalVideo" : "image",
    image: media.image,
    videoUrl: media.videoUrl,
    externalVideoUrl: media.externalVideoUrl,
    poster: media.poster,
    mobileImage: media.mobileImage,
    mobileVideoUrl: media.mobileVideoUrl,
    autoplay: media.autoplay,
    loop: media.loop,
  };
}
