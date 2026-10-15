import { tours as defaultTours, type Tour } from "@/data/tours";
import { getSiteContent } from "./content-store";

export function getTourBySlug(slug: string, tourList?: Tour[]) {
  const list = tourList || defaultTours;
  return list.find((tour) => tour.slug === slug);
}

export async function fetchTourBySlug(slug: string): Promise<Tour | undefined> {
  try {
    const content = await getSiteContent();
    return content.routes.tours.find((tour) => tour.slug === slug);
  } catch {
    return defaultTours.find((tour) => tour.slug === slug);
  }
}
