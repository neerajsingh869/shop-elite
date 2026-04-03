interface ReviewProgressBarProps {
  starNum: number;
  ratingPercentage: number;
}

function ReviewProgressBar({
  starNum,
  ratingPercentage,
}: ReviewProgressBarProps) {
  return (
    <div className="flex gap-4">
      <span className="w-12">{starNum} star</span>
      <div className="h-6 w-64 border border-zinc-800 bg-zinc-950 rounded">
        <div
          className="rounded-l h-full bg-yellow-500 overflow-hidden"
          style={{ width: `${ratingPercentage}%` }}
        ></div>
      </div>
      <span>{ratingPercentage}%</span>
    </div>
  );
}

export default ReviewProgressBar;
