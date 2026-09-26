import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { getGalleryItems } from "@/lib/content";
import GalleryPageTemplate from "@/components/GalleryPageTemplate";

export const metadata: Metadata = {
  title: "Galería — Bellaterra Conecta",
  description: "Fotografías de la finca, empresas, eventos, estancias, comunidad y pickleball en Bellaterra Conecta.",
};

export default async function GaleriaPage() {
  const { isEnabled: preview } = draftMode();
  const items = await getGalleryItems(undefined, preview);
  return <GalleryPageTemplate items={items} />;
}
