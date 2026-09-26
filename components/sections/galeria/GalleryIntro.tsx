import Container from "@/components/ui/Container";
import AnimatedIn from "@/components/ui/AnimatedIn";

/**
 * Introducción ligera de /galeria — deliberadamente NO es un hero a
 * pantalla completa como el resto de páginas: la Galería es un
 * archivo fotográfico, la foto es la protagonista desde el primer
 * scroll, no una imagen de cabecera grande.
 */
export default function GalleryIntro() {
  return (
    <section className="bg-background pb-8 pt-28 sm:pb-10 sm:pt-32">
      <Container>
        <AnimatedIn className="flex flex-col gap-3">
          <span className="font-sans text-xs uppercase tracking-[0.25em] text-olive">Galería</span>
          <h1 className="max-w-xl font-serif text-3xl leading-tight text-text sm:text-4xl">
            Bellaterra Conecta, en imágenes.
          </h1>
        </AnimatedIn>
      </Container>
    </section>
  );
}
