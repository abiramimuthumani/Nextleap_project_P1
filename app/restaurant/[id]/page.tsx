import Link from "next/link";
import { notFound } from "next/navigation";
import { apiUrl } from "@/lib/server-api";
import { Stars } from "@/app/_components/Stars";

type Review = {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
};

type RestaurantPage = {
  name: string;
  cuisine: string;
  area: string;
  averageRating: number | null;
  totalReviews: number;
  latestReview: Review | null;
  reviews: Review[];
};

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function formatDate(value: string) {
  return dateFormat.format(new Date(value));
}

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const response = await fetch(await apiUrl(`/api/restaurants/${id}`), {
    cache: "no-store",
  });

  if (response.status === 404) notFound();
  if (!response.ok) throw new Error("Could not load this restaurant.");

  const restaurant: RestaurantPage = await response.json();

  return (
    <main className="mx-auto w-full max-w-[560px] px-6 py-14 sm:py-20">
      <header>
        <h1 className="text-[30px] font-medium leading-tight tracking-[-0.02em]">
          {restaurant.name}
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          {restaurant.cuisine} · {restaurant.area}
        </p>
      </header>

      {restaurant.totalReviews === 0 ? (
        <section className="mt-10 rounded-xl border border-dashed border-line bg-card px-6 py-10 text-center">
          <p className="text-[15px] text-muted">No reviews yet.</p>
          <p className="mt-1 text-sm text-muted">Be the first to say something.</p>
        </section>
      ) : (
        <>
          <div className="mt-10 flex items-baseline gap-3">
            {/* Printed exactly as the API sent it. No adding, no dividing. */}
            <span className="text-[64px] font-light leading-none tracking-[-0.03em] tabular-nums">
              {restaurant.averageRating}
            </span>
            <span className="text-sm text-muted">
              {restaurant.totalReviews}{" "}
              {restaurant.totalReviews === 1 ? "review" : "reviews"}
            </span>
          </div>

          {restaurant.latestReview ? (
            <section className="mt-10 rounded-xl border border-line bg-card p-6">
              <p className="text-[11px] uppercase tracking-[0.14em] text-accent">
                Latest review
              </p>
              <div className="mt-3 flex items-center gap-3">
                <Stars rating={restaurant.latestReview.rating} />
                <span className="text-xs text-muted">
                  {formatDate(restaurant.latestReview.createdAt)}
                </span>
              </div>
              <p className="mt-3 text-[17px] leading-relaxed">
                {restaurant.latestReview.comment}
              </p>
            </section>
          ) : null}

          {restaurant.reviews.length > 0 ? (
            <section className="mt-12">
              <h2 className="text-[11px] uppercase tracking-[0.14em] text-muted">
                Earlier reviews
              </h2>
              <ul className="mt-2 divide-y divide-line border-t border-line">
                {restaurant.reviews.map((review) => (
                  <li key={review.id} className="py-5">
                    <div className="flex items-center gap-3">
                      <Stars rating={review.rating} />
                      <span className="text-xs text-muted">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    <p className="mt-2 text-[15px] leading-relaxed">{review.comment}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      )}

      <div className="mt-12">
        <Link
          href={`/review/${id}`}
          className="inline-flex items-center rounded-full border border-line bg-card px-5 py-3 text-sm transition-colors hover:border-accent hover:text-accent"
        >
          Write a review
        </Link>
      </div>
    </main>
  );
}
