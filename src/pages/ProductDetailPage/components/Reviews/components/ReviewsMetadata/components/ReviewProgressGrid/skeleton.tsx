import ReviewProgressBarSkeleton from "./components/ReviewProgressBar/skeleton";

function ReviewProgressGridSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {[5, 4, 3, 2, 1].map((starNum) => (
        <ReviewProgressBarSkeleton key={starNum} />
      ))}
    </div>
  );
}

export default ReviewProgressGridSkeleton;
