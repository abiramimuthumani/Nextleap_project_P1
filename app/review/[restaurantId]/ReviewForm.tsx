"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Frontend validation here is kindness (the button stays disabled).
// The real checks happen in the backend, and we show whatever error it sends back.
export default function ReviewForm({ restaurantId }: { restaurantId: number }) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = rating > 0 && comment.trim() !== "" && !submitting;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restaurantId, rating, comment }),
    });
    if (res.ok) {
      router.push(`/restaurant/${restaurantId}`);
      router.refresh();
      return;
    }
    const body = await res.json().catch(() => ({ error: "Something went wrong." }));
    setError(body.error);
    setSubmitting(false);
  }

  return (
    <form onSubmit={submit} className="mt-10 space-y-8">
      <fieldset>
        <legend className="text-sm text-muted">Your rating</legend>
        <div className="mt-2 flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              aria-label={`${star} star${star > 1 ? "s" : ""}`}
              aria-pressed={rating === star}
              className={`h-12 w-12 rounded-md border text-2xl ${
                star <= rating
                  ? "border-accent bg-accent text-paper"
                  : "border-line text-line hover:text-muted"
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </fieldset>

      <label className="block">
        <span className="text-sm text-muted">Your comment</span>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="What did you eat? How was it?"
          className="mt-2 block w-full rounded-md border border-line bg-white px-4 py-3 outline-none focus:border-accent"
        />
      </label>

      {error && <p className="rounded-md bg-accent-soft px-4 py-3 text-sm text-accent">{error}</p>}

      <button
        type="submit"
        disabled={!canSubmit}
        className="rounded-md bg-ink px-5 py-3 text-sm text-paper disabled:cursor-not-allowed disabled:opacity-30"
      >
        {submitting ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}
