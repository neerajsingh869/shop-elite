import type { Review } from "../../../../shared/types/api.types";

import WriteReview from "./components/WriteReview";
import ReviewsMetadata from "./components/ReviewsMetadata";
import ReviewGrid from "./components/ReviewGrid";
import { useState } from "react";

interface ReviewsProps {
  productId: number;
  reviews: Review[];
  totalRating: number;
}

function Reviews({ productId, reviews, totalRating }: ReviewsProps) {
  const [currentReviews, setCurrentReviews] = useState(
    localStorage.getItem(`reviews-${productId}`)
      ? (JSON.parse(localStorage.getItem(`reviews-${productId}`)!) as Review[])
      : [...reviews].reverse(),
  );

  function handleAddReview(reviewToAdd: Review) {
    setCurrentReviews((prevReviews) => {
      const updatedReviews = [reviewToAdd, ...prevReviews];
      localStorage.setItem(`reviews-${productId}`, JSON.stringify(updatedReviews));

      return updatedReviews;
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
      <div className="flex flex-col gap-8">
        <ReviewsMetadata reviews={currentReviews} totalRating={totalRating} />
        <WriteReview addReview={handleAddReview} />
      </div>
      <ReviewGrid reviews={currentReviews} />
    </div>
  );
}

export default Reviews;
