import type { Review } from "../../../../../../shared/types/api.types";
import ReviewCard from "./components/ReviewCard";

interface ReviewGridProps {
  reviews: Review[];
}

function ReviewGrid({ reviews }: ReviewGridProps) {
  return (
    <div>
      {reviews.map((reviewInfo) => (
        <ReviewCard key={`${reviewInfo.date} ${reviewInfo.reviewerEmail}`} reviewInfo={reviewInfo} />
      ))}
    </div>
  );
}

export default ReviewGrid;
