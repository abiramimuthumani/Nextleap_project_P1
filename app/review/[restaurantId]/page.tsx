import Link from "next/link";
import { notFound } from "next/navigation";
import { apiUrl } from "@/lib/server-api";
import { ReviewForm } from "@/app/_components/ReviewForm";

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ restaurantId: string }>;
}) {
  const { restaurantId } = await params;

  const response = await fetch(await apiUrl(`/api/restaurants/${restaurantId}`), {
    cache: "no-store",
  });

  if (response.status === 404) notFound();
  if (!response.ok) throw new Error("Could not load this restaurant.");

  const restaurant: { name: string } = await response.json();

  return (
    <main className="mx-auto w-full max-w-[560px] px-6 py-14 sm:py-20">
      <Link
        href={`/restaurant/${restaurantId}`}
        className="text-sm text-muted transition-colors hover:text-accent"
      >
        ← Back
      </Link>

      <header className="mt-8">
        <p className="text-[11px] uppercase tracking-[0.14em] text-muted">Reviewing</p>
        <h1 className="mt-1 text-[28px] font-medium leading-tight tracking-[-0.02em]">
          {restaurant.name}
        </h1>
      </header>

      <ReviewForm
        restaurantId={Number(restaurantId)}
        restaurantName={restaurant.name}
      />
    </main>
  );
}
