import type { Review } from "../../../../../../shared/types/api.types";

import ReviewProgressGrid from "./components/ReviewProgressGrid";
import ReviewMetadataTitle from "./components/ReviewMetadataTitle";

interface ReviewsMetadataProps {
  reviews: Review[];
  totalRating: number;
}

function ReviewsMetadata({ reviews, totalRating }: ReviewsMetadataProps) {
  return (
    <section className="flex flex-col gap-4">
      <ReviewMetadataTitle
        reviewsCount={reviews.length}
        totalRating={totalRating}
      />
      <ReviewProgressGrid reviews={reviews} />
    </section>
  );
}

export default ReviewsMetadata;
