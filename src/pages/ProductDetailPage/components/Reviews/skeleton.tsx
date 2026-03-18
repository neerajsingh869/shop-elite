import ReviewGridSkeleton from "./components/ReviewGrid/skeleton";
import ReviewsMetadataSkeleton from "./components/ReviewsMetadata/skeleton";
import WriteReview from "./components/WriteReview";

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
