import type { Review } from "../../../../../../../../shared/types/api.types";
import StarSelf from "../../../../../../../../shared/components/ui/Star";

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
    <div className="flex flex-col gap-2">
      <div className="flex gap-3">
        <div className="rounded-full bg-zinc-950 border border-zinc-800 h-10 w-10 flex justify-center items-center text-zinc-100">
          {getInitials(reviewInfo.reviewerName)}
        </div>
        <div className="flex flex-col gap-1">
          <span>{reviewInfo.reviewerName}</span>
          <span className="text-xs text-zinc-500">{reviewInfo.reviewerEmail}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((num) => {
            if (num <= Math.round(reviewInfo.rating)) {
              return (
                <StarSelf
                  size={3}
                  filled={true}
                />
              );
            }
            return (
              <StarSelf
                size={3}
                filled={false}
              />
            );
          })}
        </div>
        <p className="text-zinc-400 text-sm mb-6">{reviewInfo.comment}</p>
      </div>
    </div>
  );
}

export default ReviewCard;
