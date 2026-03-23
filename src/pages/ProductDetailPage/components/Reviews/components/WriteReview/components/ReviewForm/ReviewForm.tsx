import { useState } from "react";
import { Delete, Star } from "lucide-react";

import type { Review } from "../../../../../../../../shared/types/api.types";

interface ReviewFormProps {
  addReview: (reviewToAdd: Review) => void;
}

function ReviewForm({ addReview }: ReviewFormProps) {
  const [reviewDescription, setReviewDescription] = useState("");
  const [reviewStarsSelected, setReviewStarsSelected] = useState(0);
  const [reviewStarsActive, setReviewStarsActive] = useState(0);

  const [reviewDescriptionError, setReviewDescriptionError] = useState("");
  const [reviewStarsSelectedError, setReviewStarsSelectedError] = useState("");

  function resetReviewForm() {
    setReviewDescription("");
    setReviewStarsActive(0);
    setReviewStarsSelected(0);
  }

  function handleReviewFormSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setReviewStarsSelectedError("");
    setReviewDescriptionError("");

    if (!reviewStarsSelected) {
      setReviewStarsSelectedError("Rating is required.");
    }
    if (!reviewDescription.trim()) {
      setReviewDescriptionError("Please write a review.");
    }
    if (!reviewStarsSelected || !reviewDescription.trim()) {
      return;
    }

    const newReview: Review = {
      rating: reviewStarsSelected,
      comment: reviewDescription.trim(),
      date: new Date().toISOString(),
      reviewerName: "Anonymous",
      reviewerEmail: "anonymous@gmail.com",
    };

    addReview(newReview);
    resetReviewForm();
  }

  return (
    <form
      className="flex flex-col gap-4 items-start"
      onSubmit={(e) => handleReviewFormSubmit(e)}
    >
      <div className="flex flex-col gap-2 w-full">
        <label htmlFor="rating-input" className="text-sm text-zinc-400">
          Rating <span className="text-xs text-zinc-500">(required)</span>
        </label>
        <div className="flex gap-4 items-center">
          <div id="rating-input" className="flex gap-1">
            {[1, 2, 3, 4, 5].map((num) => {
              if (num <= Math.max(reviewStarsActive, reviewStarsSelected)) {
                return (
                  <Star
                    key={num}
                    size={24}
                    fill="oklch(85.2% 0.199 91.936)"
                    color="oklch(85.2% 0.199 91.936)"
                    strokeWidth={1.5}
                    onMouseEnter={() => setReviewStarsActive(num)}
                    onMouseLeave={() => setReviewStarsActive(0)}
                    onClick={() => setReviewStarsSelected(num)}
                  />
                );
              }
              return (
                <Star
                  key={num}
                  size={24}
                  fill="oklch(55.2% 0.016 285.938)"
                  color="oklch(55.2% 0.016 285.938)"
                  strokeWidth={1.5}
                  onMouseEnter={() => setReviewStarsActive(num)}
                />
              );
            })}
          </div>
          <Delete
            size={24}
            className="text-red-400 cursor-pointer"
            strokeWidth={1.5}
            onClick={() => setReviewStarsSelected(0)}
          />
        </div>
        {reviewStarsSelectedError && (
          <span className="text-red-400 text-xs">
            Error: {reviewStarsSelectedError}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2 w-full">
        <label htmlFor="review-input" className="text-sm text-zinc-400">
          Write a review{" "}
          <span className="text-xs text-zinc-500">(required)</span>
        </label>
        <textarea
          id="review-input"
          rows={4}
          className="border border-zinc-800 rounded-md p-2"
          value={reviewDescription}
          onChange={(e) => setReviewDescription(e.target.value)}
        ></textarea>
        {reviewDescriptionError && (
          <span className="text-red-400 text-xs">
            Error: {reviewDescriptionError}
          </span>
        )}
      </div>
      <button className="self-end border bg-yellow-500 text-black font-semibold text-sm py-2 px-6 rounded-lg transition duration-300 hover:-translate-y-0.5 hover:bg-yellow-400 cursor-pointer">
        Submit
      </button>
    </form>
  );
}

export default ReviewForm;
