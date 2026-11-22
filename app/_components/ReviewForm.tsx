"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ReviewForm({
  restaurantId,
  restaurantName,
}: {
  restaurantId: number;
  restaurantName: string;
}) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = rating > 0 && comment.trim().length > 0 && !submitting;
  const shown = hovered > 0 ? hovered : rating;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurantId, rating, comment }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        // Show exactly what the backend said. Do not invent a message.
        setError(data?.error ?? `Request failed with status ${response.status}.`);
        setSubmitting(false);
        return;
      }

      router.push(`/restaurant/${restaurantId}`);
      router.refresh();
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10">
      <fieldset>
        <legend className="text-[11px] uppercase tracking-[0.14em] text-muted">
          Your rating
        </legend>
        <div
          className="mt-3 flex items-center gap-1"
          onMouseLeave={() => setHovered(0)}
          role="radiogroup"
          aria-label="Rating from 1 to 5"
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={rating === star}
              aria-label={`${star} star${star === 1 ? "" : "s"}`}
              onMouseEnter={() => setHovered(star)}
              onFocus={() => setHovered(star)}
              onClick={() => setRating(star)}
              className={`-ml-1 rounded p-1 text-4xl leading-none transition-colors ${
                star <= shown ? "text-accent" : "text-[#cfc6b9] hover:text-[#b9ae9e]"
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-8">
        <label
          htmlFor="comment"
          className="text-[11px] uppercase tracking-[0.14em] text-muted"
        >
          Your comment
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          rows={5}
          placeholder={`What was your ${restaurantName} experience like?`}
          className="mt-3 w-full resize-none rounded-lg border border-line bg-card px-4 py-3 text-[16px] leading-relaxed outline-none transition-colors placeholder:text-[#a9a29a] focus:border-accent"
        />
      </div>

      {error ? (
        <p role="alert" className="mt-4 text-sm text-[#a33a2b]">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={!canSubmit}
        className="mt-6 w-full rounded-full bg-accent px-6 py-3 text-[15px] font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
      >
        {submitting ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}
