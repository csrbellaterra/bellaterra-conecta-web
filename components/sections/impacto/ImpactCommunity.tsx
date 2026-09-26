import type { ImpactContributor } from "@/types/content";
import Container from "@/components/ui/Container";
import AnimatedIn from "@/components/ui/AnimatedIn";
import Media from "@/components/ui/Media";

/**
 * "Comunidad que contribuye" — preparación del futuro "Hall of Fame"
 * (nombre provisional interno, ver CLAUDE.md). Fase 5 solo prepara la
 * arquitectura y una UI mínima: esta sección NUNCA se muestra vacía.
 * Solo aparece si impact.hallOfFameEnabled es true Y existe al menos
 * un impactContributor con publicationConsent = true (ya filtrado en
 * lib/content.ts → getImpactContributors / impactContributorsQuery).
 *
 * Deliberadamente sencilla — lista editorial de nombres, sin cards,
 * sin biografías largas, sin tratamiento de "muro de honor" grande:
 * eso se diseñará cuando la sección se lance de verdad.
 */
export default function ImpactCommunity({
  enabled,
  contributors,
}: {
  enabled: boolean;
  contributors: ImpactContributor[];
}) {
  if (!enabled || contributors.length === 0) return null;

  return (
    <section className="bg-background py-20 sm:py-28">
      <Container>
        <AnimatedIn className="flex flex-col gap-2 pb-10 sm:pb-14">
          <span className="font-sans text-xs uppercase tracking-[0.25em] text-olive">Comunidad que contribuye</span>
          <h2 className="max-w-2xl font-serif text-3xl leading-tight text-text sm:text-4xl">
            Personas, empresas y encuentros que ya forman parte de este impacto.
          </h2>
        </AnimatedIn>

        <div className="flex flex-wrap gap-8 sm:gap-10">
          {contributors.map((contributor, index) => {
            const media = contributor.logo ?? contributor.image;
            return (
              <AnimatedIn key={contributor.slug ?? contributor.name} delay={index * 0.05} className="flex w-32 flex-col items-center gap-3 text-center sm:w-36">
                {media ? (
                  <div className="relative aspect-square w-16 overflow-hidden rounded-full sm:w-20">
                    <Media media={{ type: "image", image: media }} alt={contributor.name} sizes="80px" />
                  </div>
                ) : null}
                <span className="font-sans text-sm text-text">{contributor.name}</span>
              </AnimatedIn>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
