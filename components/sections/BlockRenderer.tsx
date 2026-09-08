import type { Door, ImpactSettings, PageBlock } from "@/types/content";
import HeroSection from "@/components/sections/HeroSection";
import DoorSelectorSection from "@/components/sections/DoorSelectorSection";
import ImageTextSection from "@/components/sections/ImageTextSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import GallerySection from "@/components/sections/GallerySection";
import ImpactSection from "@/components/sections/ImpactSection";
import TextSection from "@/components/sections/TextSection";
import CtaSection from "@/components/sections/CtaSection";
import FullWidthMediaSection from "@/components/sections/FullWidthMediaSection";

/**
 * Traduce el array de bloques del page builder (venga de Sanity o de
 * los datos locales de respaldo) a los componentes de sección reales.
 * Es el único sitio que necesita conocer todos los tipos de bloque —
 * app/**\/page.tsx solo pasa `blocks` y, cuando aplica, `doors` /
 * `impact` para los bloques que los necesitan.
 */
export default function BlockRenderer({
  blocks,
  doors,
  impact,
}: {
  blocks: PageBlock[];
  doors?: Door[];
  impact?: ImpactSettings;
}) {
  return (
    <>
      {blocks.map((block, index) => {
        switch (block._type) {
          case "heroSection":
            return <HeroSection key={index} block={block} priority={index === 0} />;
          case "doorSelectorSection":
            return doors ? <DoorSelectorSection key={index} block={block} doors={doors} /> : null;
          case "imageTextSection":
            return <ImageTextSection key={index} block={block} />;
          case "experienceSection":
            return <ExperienceSection key={index} block={block} />;
          case "gallerySection":
            return <GallerySection key={index} block={block} />;
          case "impactSection":
            return impact ? <ImpactSection key={index} block={block} impact={impact} /> : null;
          case "textSection":
            return <TextSection key={index} block={block} />;
          case "ctaSection":
            return <CtaSection key={index} block={block} />;
          case "fullWidthMediaSection":
            return <FullWidthMediaSection key={index} block={block} />;
          default:
            return null;
        }
      })}
    </>
  );
}
