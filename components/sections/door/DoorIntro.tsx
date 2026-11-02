import type { Door } from "@/types/content";
import CinematicIntro from "@/components/cinematic/CinematicIntro";
import DoorCover from "@/components/cinematic/DoorCover";
import DoorHero from "@/components/sections/door/DoorHero";
import { DOOR_PAGE_COPY, type DoorCopyId } from "@/lib/doorCopy";
import { experienceCopy, getDoorExperience, resolveIntro } from "@/lib/doorExperience";

/** id del primer bloque tras la introducción, destino de «Saltar introducción». */
export const DOOR_INFO_ID = "informacion";

/**
 * Bloque A de las páginas de experiencia: la introducción cinematográfica si
 * la puerta tiene escenas suficientes (Sanity o lib/doorExperience.ts), su
 * portada editorial si no, y el hero estático de siempre como último recurso.
 * Los textos siguen el mismo orden que DoorHero.
 */
export default function DoorIntro({ door }: { door: Door }) {
  const intro = resolveIntro(door);
  if (!intro) return <DoorHero door={door} />;

  const copy = DOOR_PAGE_COPY[door.id as DoorCopyId];
  const fallbackCta = getDoorExperience(door.id)?.ctaLabel ?? copy.hero.ctaLabel;
  const props = {
    eyebrow: door.heroEyebrow || door.eyebrow || copy.hero.eyebrow,
    headline: door.heroHeadline || door.headline || copy.hero.headline,
    description: door.heroDescription || door.introduction || copy.hero.description,
    ctaLabel: experienceCopy(door.primaryCtaLabel, fallbackCta),
    ctaHref: `/solicitud/${door.primaryForm || door.slug}`,
    skipTo: DOOR_INFO_ID,
  };
  return intro.kind === "film" ? <CinematicIntro scenes={intro.scenes} {...props} /> : <DoorCover scene={intro.scene} {...props} />;
}
