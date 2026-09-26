import type { MetadataRoute } from "next";
import { DOOR_IDS } from "@/lib/content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/nuestra-historia", "/contacto", "/impacto"];
  const doorRoutes = DOOR_IDS.map((id) => `/${id}`);

  return [...staticRoutes, ...doorRoutes].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
