import { tours } from "@/data/tours";

export function getTourBySlug(slug: string) {
  return tours.find((tour) => tour.slug === slug);
}
