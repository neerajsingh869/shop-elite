import { useState } from "react";
import { Delete } from "lucide-react";

import type { Review } from "../../../../../../../../shared/types/api.types";
import StarSelf from "../../../../../../../../shared/components/ui/Star";

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
      id: Date.now(),
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
      {/*
        This used to be five <svg onClick> with a label pointing at a div -
        invalid, and completely unusable without a mouse. Native radios in a
        fieldset give us arrow key navigation, Space to select, a group name
        from the legend and the required/invalid states, all for free.
        The inputs are sr-only rather than hidden so they stay focusable.
      */}
      <fieldset className="flex flex-col gap-2 w-full">
        <legend className="text-sm text-zinc-400 mb-2">
          Rating <span className="text-xs text-zinc-400">(required)</span>
        </legend>
        <div className="flex gap-4 items-center">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((num) => (
              <label
                key={num}
                onMouseEnter={() => setReviewStarsActive(num)}
                onMouseLeave={() => setReviewStarsActive(0)}
                className="cursor-pointer rounded has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-yellow-500 has-[:focus-visible]:outline-offset-2"
              >
                <input
                  type="radio"
                  name="rating"
                  value={num}
                  checked={reviewStarsSelected === num}
                  onChange={() => {
                    setReviewStarsSelected(num);
                    setReviewStarsSelectedError("");
                  }}
                  // no aria-invalid here - validity applies to the group, not
                  // to one radio, and the role does not support it.
                  // aria-describedby does work, so the error is read out when
                  // any star in the group takes focus.
                  aria-describedby={
                    reviewStarsSelectedError ? "rating-error" : undefined
                  }
                  className="sr-only"
                />
                <span className="sr-only">
                  {num} star{num > 1 ? "s" : ""}
                </span>
                <StarSelf
                  size={6}
                  filled={
                    num <= Math.max(reviewStarsActive, reviewStarsSelected)
                  }
                />
              </label>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setReviewStarsSelected(0)}
            aria-label="Clear rating"
            className="rounded cursor-pointer"
          >
            <Delete
              size={24}
              aria-hidden="true"
              className="text-red-400"
              strokeWidth={1.5}
            />
          </button>
        </div>
        {reviewStarsSelectedError && (
          // role="alert" so the message is spoken when it appears - otherwise
          // a screen reader user submits and hears nothing at all
          <span id="rating-error" role="alert" className="text-red-400 text-xs">
            Error: {reviewStarsSelectedError}
          </span>
        )}
      </fieldset>
      <div className="flex flex-col gap-2 w-full">
        <label htmlFor="review-input" className="text-sm text-zinc-400">
          Write a review <span className="text-xs text-zinc-400">(required)</span>
        </label>
        <textarea
          id="review-input"
          rows={4}
          className="border border-zinc-800 rounded-md p-2"
          value={reviewDescription}
          onChange={(e) => {
            setReviewDescription(e.target.value);
            if (e.target.value.trim()) setReviewDescriptionError("");
          }}
          aria-invalid={reviewDescriptionError ? true : undefined}
          aria-describedby={
            reviewDescriptionError ? "review-error" : undefined
          }
        ></textarea>
        {reviewDescriptionError && (
          <span id="review-error" role="alert" className="text-red-400 text-xs">
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
