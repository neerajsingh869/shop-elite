import StarSelf from "../../../../../../../../shared/components/ui/Star";

interface ReviewMetadataTitleProps {
  reviewsCount: number;
  totalRating: number;
}

function ReviewMetadataTitle({
  reviewsCount,
  totalRating,
}: ReviewMetadataTitleProps) {
  return (
    <div>
      <h1 className="text-zinc-100 text-xl">Customer Reviews</h1>
      <div className="py-1 flex gap-3 items-center w-full">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((num) => {
            console.log(totalRating);
            console.log(Math.round(totalRating));
            if (num <= Math.round(totalRating)) {
              return <StarSelf size={3} filled={true} />;
            }
            return <StarSelf size={3} filled={false} />;
          })}
        </div>
        <span className="text-zinc-100 text-sm font-bold">{totalRating}</span>
        <span className="text-sm text-zinc-500">{reviewsCount} reviews</span>
      </div>
    </div>
  );
}

export default ReviewMetadataTitle;
