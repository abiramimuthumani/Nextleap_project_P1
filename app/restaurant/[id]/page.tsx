import Link from "next/link";
import { notFound } from "next/navigation";
import { getRestaurant, type Review } from "@/lib/api";

export const dynamic = "force-dynamic";

// This file only renders. Every number arrives ready-made from GET /api/restaurants/[id].
export default async function RestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getRestaurant(id);
  if (!data) notFound();

  return (
    <article>
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">{data.name}</h1>
        <p className="mt-1 text-sm text-muted">
          {data.cuisine} · {data.area}
        </p>
      </header>

      {data.latestReview ? (
        <>
          <section className="mt-12 flex items-baseline gap-3">
            <span className="text-7xl font-semibold tracking-tight">{data.averageRating}</span>
            <span className="text-sm text-muted">
              stars · {data.totalReviews} {data.totalReviews === 1 ? "review" : "reviews"}
            </span>
          </section>

          <section className="mt-12">
            <h2 className="text-xs uppercase tracking-widest text-accent">Latest review</h2>
            <div className="mt-3 rounded-lg border-l-2 border-accent bg-accent-soft px-5 py-4">
              <ReviewBody review={data.latestReview} />
            </div>
          </section>

          {data.reviews.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xs uppercase tracking-widest text-muted">Earlier reviews</h2>
              <ul className="mt-3 divide-y divide-line border-y border-line">
                {data.reviews.map((review) => (
                  <li key={review.id} className="py-4">
                    <ReviewBody review={review} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      ) : (
        <section className="mt-12 rounded-lg border border-dashed border-line px-5 py-10 text-center">
          <p className="text-lg">No reviews yet.</p>
          <p className="mt-1 text-sm text-muted">Be the first to say how it was.</p>
        </section>
      )}

      <Link
        href={`/review/${id}`}
        className="mt-12 inline-block rounded-md bg-ink px-5 py-3 text-sm text-paper"
      >
        Write a review
      </Link>
    </article>
  );
}

function ReviewBody({ review }: { review: Review }) {
  return (
    <>
      <p className="text-sm text-accent" aria-label={`${review.rating} out of 5 stars`}>
        {"★".repeat(review.rating)}
        <span className="text-line">{"★".repeat(5 - review.rating)}</span>
      </p>
      <p className="mt-1">{review.comment}</p>
      <p className="mt-1 text-xs text-muted">
        {new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
      </p>
    </>
  );
}
