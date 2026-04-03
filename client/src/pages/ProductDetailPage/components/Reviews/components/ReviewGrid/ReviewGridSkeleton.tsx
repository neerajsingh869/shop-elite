import ReviewCardSkeleton from "./components/ReviewCard/ReviewCardSkeleton";

function ReviewGridSkeleton() {
  return (
    <div>
      {Array.from({ length: 10 }).map((_, index) => (
        <ReviewCardSkeleton key={index} />
      ))}
    </div>
  );
}

export default ReviewGridSkeleton;
