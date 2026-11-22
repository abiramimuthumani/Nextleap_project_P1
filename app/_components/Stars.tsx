// Read-only stars. It renders a fact ("this review was 4 stars"),
// it does not calculate anything.

export function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-[2px]" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          aria-hidden="true"
          className={star <= rating ? "text-accent" : "text-line"}
        >
          ★
        </span>
      ))}
    </span>
  );
}
