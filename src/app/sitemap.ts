import type { MetadataRoute } from "next";
import { tripPlans } from "@/content/trip-plans";
import { SITE_URL } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/trips`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    ...tripPlans.map((t) => ({ url: `${SITE_URL}/trips/${t.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: `${SITE_URL}/cookies`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
