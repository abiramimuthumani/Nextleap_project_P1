import { notFound } from "next/navigation";
import { getRestaurant } from "@/lib/api";
import ReviewForm from "./ReviewForm";

export const dynamic = "force-dynamic";

export default async function ReviewPage({ params }: { params: Promise<{ restaurantId: string }> }) {
  const { restaurantId } = await params;
  const data = await getRestaurant(restaurantId);
  if (!data) notFound();

  return (
    <article>
      <p className="text-xs uppercase tracking-widest text-muted">Write a review</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{data.name}</h1>
      <ReviewForm restaurantId={Number(restaurantId)} />
    </article>
  );
}
