import { headers } from "next/headers";

export type Review = { id: number; rating: number; comment: string; createdAt: string };
export type RestaurantPage = {
  name: string;
  cuisine: string;
  area: string;
  averageRating: number | null;
  totalReviews: number;
  latestReview: Review | null;
  reviews: Review[];
};

// Server components call our own API over HTTP, exactly like any other visitor would.
export async function getRestaurant(id: string): Promise<RestaurantPage | null> {
  const h = await headers();
  const host = h.get("host");
  const protocol = h.get("x-forwarded-proto") ?? "http";
  const res = await fetch(`${protocol}://${host}/api/restaurants/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}
