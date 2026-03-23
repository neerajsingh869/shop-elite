import ReviewMetadataTitleSkeleton from "./components/ReviewMetadataTitle/ReviewMetadataTitleSkeleton";
import ReviewProgressGridSkeleton from "./components/ReviewProgressGrid/ReviewProgressGridSkeleton";

function ReviewsMetadataSkeleton() {
  return (
    <section className="flex flex-col gap-4">
      <ReviewMetadataTitleSkeleton />
      <ReviewProgressGridSkeleton />
    </section>
  );
}

export default ReviewsMetadataSkeleton;
