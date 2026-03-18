import type { Review } from "../../../../shared/types/api.types";

import WriteReview from "./components/WriteReview";
import ReviewsMetadata from "./components/ReviewsMetadata";
import ReviewGrid from "./components/ReviewGrid";

interface ReviewsProps {
  reviews: Review[];
  totalRating: number;
}

function Reviews({ reviews, totalRating }: ReviewsProps) {
  reviews.sort((reviewA, reviewB) => reviewB.rating - reviewA.rating);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
      <div className="flex flex-col gap-8">
        <ReviewsMetadata reviews={reviews} totalRating={totalRating} />
        <WriteReview />
      </div>
      <ReviewGrid reviews={reviews} />
    </div>
  );
}

export default Reviews;
