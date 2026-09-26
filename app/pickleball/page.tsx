import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { getAllDoors, getDoor, getUpcomingEvents } from "@/lib/content";
import DoorPageTemplatePickleball from "@/components/DoorPageTemplatePickleball";

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
  const [door, allDoors, upcomingFamilyDays] = await Promise.all([
    getDoor(DOOR_ID, preview),
    getAllDoors(preview),
    getUpcomingEvents("familyDay", preview),
  ]);
  if (!door) notFound();
  return <DoorPageTemplatePickleball door={door} allDoors={allDoors} upcomingFamilyDays={upcomingFamilyDays} />;
}
