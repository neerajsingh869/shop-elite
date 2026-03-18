import ReviewMetadataTitleSkeleton from "./components/ReviewMetadataTitle/skeleton";
import ReviewProgressGridSkeleton from "./components/ReviewProgressGrid/skeleton";

function ReviewsMetadataSkeleton() {
  return (
    <section className="flex flex-col gap-4">
      <ReviewMetadataTitleSkeleton />
      <ReviewProgressGridSkeleton />
    </section>
  );
}

export default ReviewsMetadataSkeleton;
