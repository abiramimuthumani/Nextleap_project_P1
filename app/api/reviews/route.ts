// POST /api/reviews — save one review.
//
// This is the kitchen. It checks the order before cooking anything.
// The frontend already limits stars to 1-5, but the frontend is only a
// polite visitor. Anyone with a terminal can call this URL directly,
// so the checks below are the real security.

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const sql = db();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Send a JSON body with restaurantId, rating and comment." },
      { status: 400 }
    );
  }

  const { restaurantId, rating, comment } = (body ?? {}) as {
    restaurantId?: unknown;
    rating?: unknown;
    comment?: unknown;
  };

  // Check 1 — rating is a whole number from 1 to 5.
  if (typeof rating !== "number" || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: "Rating must be a whole number from 1 to 5." },
      { status: 400 }
    );
  }

  // Check 2 — comment is not empty once whitespace is trimmed.
  if (typeof comment !== "string" || comment.trim().length === 0) {
    return NextResponse.json({ error: "Comment cannot be empty." }, { status: 400 });
  }

  // Check 3 — the restaurant actually exists. This one needs the database.
  if (typeof restaurantId !== "number" || !Number.isInteger(restaurantId)) {
    return NextResponse.json(
      { error: "Restaurant id must be a whole number." },
      { status: 400 }
    );
  }

  const restaurant = (await sql`
    SELECT id FROM restaurants WHERE id = ${restaurantId}
  `) as Record<string, unknown>[];

  if (restaurant.length === 0) {
    return NextResponse.json(
      { error: `Restaurant ${restaurantId} does not exist.` },
      { status: 400 }
    );
  }

  // All checks passed. Write exactly one row. Nothing else changes.
  const inserted = (await sql`
    INSERT INTO reviews (restaurant_id, rating, comment)
    VALUES (${restaurantId}, ${rating}, ${comment.trim()})
    RETURNING id
  `) as { id: number }[];

  return NextResponse.json(
    { success: true, reviewId: inserted[0].id },
    { status: 201 }
  );
}
