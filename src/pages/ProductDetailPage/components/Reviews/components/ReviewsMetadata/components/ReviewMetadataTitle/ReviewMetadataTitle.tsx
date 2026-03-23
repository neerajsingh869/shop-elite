import { Star } from "lucide-react";

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
              return (
                <Star
                  size={12}
                  fill="oklch(85.2% 0.199 91.936)"
                  color="oklch(85.2% 0.199 91.936)"
                  strokeWidth={1.5}
                />
              );
            }
            return (
              <Star
                size={12}
                fill="oklch(0.552 0.016 285.938)"
                color="oklch(0.552 0.016 285.938)"
                strokeWidth={1.5}
              />
            );
          })}
        </div>
        <span className="text-zinc-100 text-sm font-bold">{totalRating}</span>
        <span className="text-sm text-zinc-500">{reviewsCount} reviews</span>
      </div>
    </div>
  );
}

export default ReviewMetadataTitle;
