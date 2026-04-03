import ReviewGridSkeleton from "./components/ReviewGrid/ReviewGridSkeleton";
import ReviewsMetadataSkeleton from "./components/ReviewsMetadata/ReviewsMetadataSkeleton";
import WriteReview from "./components/WriteReview/WriteReview";

function ReviewsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
      <div className="flex flex-col gap-8">
        <ReviewsMetadataSkeleton />
        <WriteReview />
      </div>
      <ReviewGridSkeleton />
    </div>
  );
}

export default ReviewsSkeleton;
