interface ReviewProgressBarProps {
  starNum: number;
  ratingPercentage: number;
}

function ReviewProgressBar({
  starNum,
  ratingPercentage,
}: ReviewProgressBarProps) {
  // guard against 0 reviews, which makes the percentage NaN
  const safePercentage = Number.isFinite(ratingPercentage)
    ? ratingPercentage
    : 0;

  return (
    <div className="flex gap-4">
      <span className="w-12" aria-hidden="true">
        {starNum} star
      </span>
      {/*
        The bar was a styled div, so its value existed only as a pixel width.
        role="progressbar" plus the value attributes is what actually puts the
        number into the accessibility tree - the label and value together are
        announced as "5 star reviews, 45%".
      */}
      <div
        role="progressbar"
        aria-label={`${starNum} star reviews`}
        aria-valuenow={safePercentage}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-6 w-64 border border-zinc-800 bg-zinc-950 rounded"
      >
        <div
          aria-hidden="true"
          className="rounded-l h-full bg-yellow-500 overflow-hidden"
          style={{ width: `${safePercentage}%` }}
        ></div>
      </div>
      <span aria-hidden="true">{safePercentage}%</span>
    </div>
  );
}

export default ReviewProgressBar;
