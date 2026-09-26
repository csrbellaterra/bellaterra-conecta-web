import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { getStoryPage } from "@/lib/content";
import StoryPageTemplate from "@/components/StoryPageTemplate";

export async function generateMetadata(): Promise<Metadata> {
  const story = await getStoryPage();
  return {
    title: story.seo.title,
    description: story.seo.description,
  };
}

export default async function NuestraHistoriaPage() {
  const { isEnabled: preview } = draftMode();
  const story = await getStoryPage(preview);
  return <StoryPageTemplate story={story} />;
}
