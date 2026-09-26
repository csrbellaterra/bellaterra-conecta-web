import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { getAllDoors, getDoor } from "@/lib/content";
import DoorPageTemplateV2 from "@/components/DoorPageTemplateV2";

const DOOR_ID = "eventos" as const;

export async function generateMetadata(): Promise<Metadata> {
  const door = await getDoor(DOOR_ID);
  if (!door) return {};
  return {
    title: door.seo.title,
    description: door.seo.description,
  };
}

export default async function EventosPage() {
  const { isEnabled: preview } = draftMode();
  const [door, allDoors] = await Promise.all([getDoor(DOOR_ID, preview), getAllDoors(preview)]);
  if (!door) notFound();
  return <DoorPageTemplateV2 door={door} allDoors={allDoors} />;
}
