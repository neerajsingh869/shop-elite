import type { Review } from "../../../../../../../../shared/types/api.types";
import ReviewProgressBar from "./components/ReviewProgressBar";

function getStarPercentage(starNum: number, reviews: Review[]) {
  const totalReviewsCount = reviews.length;

  const startNumReviewsCount = reviews.filter(
    (review) => review.rating === starNum,
  ).length;
  return Math.round((startNumReviewsCount / totalReviewsCount) * 100);
}

interface ReviewProgressGridProps {
  reviews: Review[];
}

function ReviewProgressGrid({ reviews }: ReviewProgressGridProps) {
  return (
    <div className="flex flex-col gap-2">
      {[5, 4, 3, 2, 1].map((starNum) => (
        <ReviewProgressBar
          key={starNum}
          starNum={starNum}
          ratingPercentage={getStarPercentage(starNum, reviews)}
        />
      ))}
    </div>
  );
}

export default ReviewProgressGrid;
