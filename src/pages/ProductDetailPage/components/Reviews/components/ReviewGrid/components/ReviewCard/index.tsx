import { Star } from "lucide-react";
import type { Review } from "../../../../../../../../shared/types/api.types";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

interface ReviewCardProps {
  reviewInfo: Review;
}

function ReviewCard({ reviewInfo }: ReviewCardProps) {
  return (
    <div>
      <div className="flex gap-3">
        <div className="rounded-full bg-zinc-950 border border-zinc-800 h-10 w-10 flex justify-center items-center text-zinc-100">
          {getInitials(reviewInfo.reviewerName)}
        </div>
        <div>
          <span>{reviewInfo.reviewerName}</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((num) => {
              if (num <= Math.ceil(reviewInfo.rating)) {
                return (
                  <Star
                    key={num}
                    size={12}
                    fill="oklch(85.2% 0.199 91.936)"
                    color="oklch(85.2% 0.199 91.936)"
                    strokeWidth={1.5}
                  />
                );
              }
              return (
                <Star
                  key={num}
                  size={12}
                  fill="oklch(55.2% 0.016 285.938)"
                  color="oklch(55.2% 0.016 285.938)"
                  strokeWidth={1.5}
                />
              );
            })}
          </div>
        </div>
      </div>
      <p className="text-zinc-400 text-sm mt-2 mb-6">{reviewInfo.comment}</p>
    </div>
  );
}

export default ReviewCard;
