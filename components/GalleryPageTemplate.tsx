import type { GalleryItem } from "@/types/content";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GalleryIntro from "@/components/sections/galeria/GalleryIntro";
import GalleryExplorer from "@/components/sections/galeria/GalleryExplorer";

/**
 * Plantilla de /galeria (Fase 5). Intro ligera → filtros + masonry +
 * lightbox (todo en GalleryExplorer, componente cliente único).
 */
export default function GalleryPageTemplate({ items }: { items: GalleryItem[] }) {
  return (
    <>
      <Header variant="solid" />
      <main>
        <GalleryIntro />
        <GalleryExplorer items={items} />
      </main>
      <Footer />
    </>
  );
}
