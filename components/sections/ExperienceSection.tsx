import type { ExperienceBlock } from "@/types/content";
import ImageTextSection from "@/components/sections/ImageTextSection";

/**
 * Las 5 secciones de experiencia de la home comparten exactamente el
 * mismo diseño que ImageTextSection; este componente existe como
 * tipo propio (según la arquitectura de bloques pedida) pero delega
 * el render para no duplicar código.
 */
export default function ExperienceSection({ block }: { block: ExperienceBlock }) {
  return <ImageTextSection block={block} />;
}
