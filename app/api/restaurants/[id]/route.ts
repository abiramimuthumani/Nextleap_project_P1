import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET /api/restaurants/[id]: every answer below is computed fresh, right now.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const restaurantId = Number(id);
  if (!Number.isInteger(restaurantId)) {
    return Response.json({ error: "Restaurant not found." }, { status: 404 });
  }

  const restaurants = await sql`
    SELECT name, cuisine, area FROM restaurants WHERE id = ${restaurantId}
  `;
  if (restaurants.length === 0) {
    return Response.json({ error: "Restaurant not found." }, { status: 404 });
  }

  // The intelligence of the product: AVG and COUNT, computed on request.
  const stats = await sql`
    SELECT ROUND(AVG(rating), 1)::float AS "averageRating",
           COUNT(*)::int               AS "totalReviews"
    FROM reviews
    WHERE restaurant_id = ${restaurantId}
  `;

  // Newest first. The first one is the latest review; the rest are the older list.
  const allReviews = await sql`
    SELECT id, rating, comment, created_at AS "createdAt"
    FROM reviews
    WHERE restaurant_id = ${restaurantId}
    ORDER BY created_at DESC, id DESC
  `;

  const [latestReview = null, ...reviews] = allReviews;

  return Response.json({
    ...restaurants[0],
    averageRating: stats[0].averageRating, // AVG(rating) gives NULL when there are no reviews
    totalReviews: stats[0].totalReviews,
    latestReview,
    reviews,
  });
}
