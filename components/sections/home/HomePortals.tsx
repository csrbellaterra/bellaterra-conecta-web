import Image from "next/image";
import Link from "next/link";
import type { Door, SanityImage } from "@/types/content";
import AnimatedIn from "@/components/ui/AnimatedIn";
import { HOME_PORTAL_COPY, HOME_V2_COPY, PRIMARY_DOOR_IDS, v2Copy, type PrimaryDoorId } from "@/lib/homeCopy";

/**
 * "Cuatro portales" de la Home V2: cuatro paneles fotográficos grandes,
 * uno por experiencia, toda la superficie clicable.
 *
 * - Desktop (lg+): los cuatro en una sola fila, misma altura y misma
 *   línea base de texto para poder compararlos de un vistazo. El panel
 *   activo (hover o foco de teclado) se ensancha suavemente y su foto
 *   se acerca; los demás ceden espacio.
 * - Tablet (sm–lg): 2×2. Móvil: paneles verticales grandes apilados.
 * - Número, nombre y descripción siempre visibles: el hover solo
 *   enfatiza, nunca revela información.
 *
 * Contenido (Sanity → fallback): nombre = door.name; descripción =
 * door.eyebrow ("Descripción corta para la tarjeta del selector");
 * imagen = door.homeMedia → foto aprobada provisional → selectorImage.
 */

// Fotografías aprobadas en docs/fase-cinematica/SELECCION_PRIORITARIA.md
// para cada página. Provisionales hasta que se suban a door.homeMedia.
const PROVISIONAL_IMAGES: Record<PrimaryDoorId, SanityImage> = {
  empresas: { url: "/images/home/portales/empresas.jpg", alt: "Mesa de reuniones con pantalla en el comedor de la finca", width: 1500, height: 2000 },
  eventos: { url: "/images/home/portales/eventos.jpg", alt: "Mesa de banquete preparada junto a la piscina", width: 1500, height: 2000 },
  // Habitación 1 (_RA60292, 2024), aprobada el 31/10/2026 (ver docs/fase-cinematica/PORTALES_FOTOS_PROPUESTA.md).
  estancias: { url: "/images/home/portales/estancias.jpg", alt: "Habitación luminosa con cama de matrimonio junto a la ventana y zona de estar", width: 2000, height: 1333, hotspot: { x: 25, y: 50 } },
  comunidad: { url: "/images/home/portales/comunidad.jpg", alt: "Terraza chill out con mesas de madera y pinos", width: 2000, height: 1500, hotspot: { x: 40, y: 50 } },
};

function portalImage(door: Door, id: PrimaryDoorId): SanityImage {
  return door.homeMedia?.image ?? PROVISIONAL_IMAGES[id] ?? door.selectorImage;
}

export default function HomePortals({
  doors,
  heading,
  introduction,
}: {
  doors: Door[];
  heading?: string;
  introduction?: string;
}) {
  const portals = PRIMARY_DOOR_IDS.map((id) => doors.find((d) => d.id === id)).filter((d): d is Door => !!d);

  return (
    <section id="experiencias" aria-labelledby="experiencias-title" className="scroll-mt-0 bg-background pb-16 pt-20 sm:pb-24 sm:pt-24 lg:pb-28">
      <div className="mx-auto w-full max-w-content px-5 sm:px-8 lg:px-12">
        <AnimatedIn className="mb-10 grid gap-4 sm:mb-12 lg:grid-cols-[1fr_auto] lg:items-end">
          <h2 id="experiencias-title" className="max-w-2xl font-serif text-4xl leading-[1.05] text-text sm:text-5xl lg:text-[3.5rem]">
            {v2Copy(heading, HOME_V2_COPY.portalsHeading)}
          </h2>
          <p className="font-sans text-base text-muted sm:text-lg lg:pb-3">
            {v2Copy(introduction, HOME_V2_COPY.portalsIntroduction)}
          </p>
        </AnimatedIn>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:flex lg:gap-4">
          {portals.map((door, index) => {
            const id = door.id as PrimaryDoorId;
            const image = portalImage(door, id);
            const description = v2Copy(door.eyebrow, HOME_PORTAL_COPY[id].description);
            return (
              <li
                key={door.id}
                className="group/portal lg:min-w-0 lg:flex-1 lg:transition-[flex-grow] lg:duration-700 lg:ease-[cubic-bezier(0.22,1,0.36,1)] lg:hover:flex-[1.4] lg:focus-within:flex-[1.4]"
              >
                <AnimatedIn delay={index * 0.08}>
                  <Link
                    href={`/${door.slug}`}
                    className="relative block aspect-[4/5] w-full overflow-hidden bg-ink outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-olive sm:aspect-[3/4] lg:aspect-auto lg:h-[clamp(460px,62vh,580px)]"
                  >
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      sizes="(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/portal:scale-[1.045] group-focus-within/portal:scale-[1.045]"
                      style={image.hotspot ? { objectPosition: `${image.hotspot.x}% ${image.hotspot.y}%` } : undefined}
                    />
                    {/* Velos de legibilidad, fijos (no dependen del hover): uno
                        corto arriba para el número y uno inferior para nombre,
                        descripción y enlace. */}
                    <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink/45 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-ink/90 via-ink/55 via-45% to-transparent" />

                    <span className="absolute left-5 top-5 font-sans text-xs tracking-[0.3em] text-white/90 sm:left-6 sm:top-6">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-5 sm:p-6 lg:p-6 xl:p-7">
                      <h3 className="font-serif text-[2.5rem] leading-none text-white sm:text-[2.6rem] lg:text-[clamp(2.1rem,2.9vw,2.9rem)]">{door.name}</h3>
                      {/* Altura mínima de dos líneas: los cuatro títulos quedan a la misma altura. */}
                      <p className="min-h-[3.25em] max-w-[19rem] font-sans text-[15px] leading-relaxed text-white/90">{description}</p>
                      <span className="mt-1 inline-flex items-center gap-3 font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-white">
                        Descubrir
                        <span
                          aria-hidden
                          className="block h-px w-8 bg-white/80 transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/portal:w-14 group-focus-within/portal:w-14"
                        />
                      </span>
                    </div>
                  </Link>
                </AnimatedIn>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
