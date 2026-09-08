import Link from "next/link";
import type { Door } from "@/types/content";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/ui/Container";
import Media from "@/components/ui/Media";
import AnimatedIn from "@/components/ui/AnimatedIn";
import BlockRenderer from "@/components/sections/BlockRenderer";
import GallerySection from "@/components/sections/GallerySection";
import PlastyBadge from "@/components/PlastyBadge";

/**
 * Plantilla compartida por las 5 páginas de puerta
 * (/empresas, /eventos, /estancias, /comunidad, /pickleball).
 * Cada page.tsx solo tiene que buscar su Door y pasarlo aquí — así
 * las 5 páginas quedan consistentes y cualquier cambio de diseño se
 * hace en un único sitio.
 */
export default function DoorPageTemplate({ door }: { door: Door }) {
  return (
    <>
      <Header variant="solid" />
      <main>
        <section className="relative flex h-[70vh] min-h-[420px] w-full items-end overflow-hidden bg-ink">
          <Media media={door.heroMedia} alt={door.headline} priority sizes="100vw" className="brightness-[0.85]" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
          <Container className="relative z-10 pb-14">
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-white/70">
              {String(door.order).padStart(2, "0")} · {door.name}
            </span>
            <h1 className="mt-3 max-w-2xl font-serif text-4xl leading-[1.1] text-white sm:text-5xl">
              {door.headline}
            </h1>
          </Container>
        </section>

        <section className="bg-background py-14 sm:py-20">
          <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[2fr_1fr] lg:gap-16">
            <AnimatedIn>
              <p className="max-w-2xl font-sans text-lg leading-relaxed text-muted">{door.introduction}</p>
              <Link
                href={door.ctaUrl}
                className="mt-6 inline-flex w-fit items-center gap-2 rounded-pill bg-olive px-6 py-3 font-sans text-sm font-medium tracking-wide text-white transition-colors hover:bg-olive-dark"
              >
                {door.ctaLabel} <span aria-hidden>→</span>
              </Link>
            </AnimatedIn>

            {door.plastyContribution ? (
              <AnimatedIn delay={0.1}>
                <PlastyBadge contribution={door.plastyContribution} />
              </AnimatedIn>
            ) : null}
          </Container>
        </section>

        {door.contentBlocks?.length ? <BlockRenderer blocks={door.contentBlocks} /> : null}

        {door.gallery?.length ? (
          <GallerySection block={{ _type: "gallerySection", heading: "Galería", images: door.gallery }} />
        ) : null}
      </main>
      <Footer />
    </>
  );
}
