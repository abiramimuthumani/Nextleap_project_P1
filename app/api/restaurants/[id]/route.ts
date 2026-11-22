// GET /api/restaurants/[id] — load one restaurant page.
//
// Every number below is computed fresh, right now, from the review rows.
// Nothing is read from a stored "average" because no such column exists.

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

function iso(value: unknown) {
  if (value instanceof Date) return value.toISOString();
  return new Date(String(value)).toISOString();
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const sql = db();
  const { id } = await params;
  const restaurantId = Number(id);

  if (!Number.isInteger(restaurantId) || restaurantId < 1) {
    return NextResponse.json({ error: "Restaurant not found." }, { status: 404 });
  }

  const restaurants = (await sql`
    SELECT id, name, cuisine, area FROM restaurants WHERE id = ${restaurantId}
  `) as Record<string, unknown>[];

  if (restaurants.length === 0) {
    return NextResponse.json({ error: "Restaurant not found." }, { status: 404 });
  }

  const restaurant = restaurants[0];

  // The three lines that are the entire intelligence of this product.
  const stats = (await sql`
    SELECT COUNT(*)::int                          AS total_reviews,
           ROUND(AVG(rating)::numeric, 1)::float8 AS average_rating
      FROM reviews
     WHERE restaurant_id = ${restaurantId}
  `) as { total_reviews: number; average_rating: number | null }[];

  const latestRows = (await sql`
    SELECT id, rating, comment, created_at
      FROM reviews
     WHERE restaurant_id = ${restaurantId}
     ORDER BY created_at DESC, id DESC
     LIMIT 1
  `) as Record<string, unknown>[];

  const olderRows = latestRows.length
    ? ((await sql`
        SELECT id, rating, comment, created_at
          FROM reviews
         WHERE restaurant_id = ${restaurantId} AND id <> ${latestRows[0].id}
         ORDER BY created_at DESC, id DESC
      `) as Record<string, unknown>[])
    : [];

  const toReview = (row: Record<string, unknown>) => ({
    id: row.id as number,
    rating: row.rating as number,
    comment: row.comment as string,
    createdAt: iso(row.created_at),
  });

  return NextResponse.json({
    name: restaurant.name,
    cuisine: restaurant.cuisine,
    area: restaurant.area,
    averageRating: stats[0].average_rating, // null when there are no reviews yet
    totalReviews: stats[0].total_reviews,   // 0 when there are none
    latestReview: latestRows.length ? toReview(latestRows[0]) : null,
    reviews: olderRows.map(toReview),
  });
}
