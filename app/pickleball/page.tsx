import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { getDoor } from "@/lib/content";
import DoorPageTemplate from "@/components/DoorPageTemplate";

const DOOR_ID = "pickleball" as const;

export async function generateMetadata(): Promise<Metadata> {
  const door = await getDoor(DOOR_ID);
  if (!door) return {};
  return {
    title: door.seo.title,
    description: door.seo.description,
  };
}

export default async function PickleballPage() {
  const { isEnabled: preview } = draftMode();
  const door = await getDoor(DOOR_ID, preview);
  if (!door) notFound();
  return <DoorPageTemplate door={door} />;
}
