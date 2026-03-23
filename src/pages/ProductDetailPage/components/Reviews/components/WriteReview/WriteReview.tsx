import type { Review } from "../../../../../../shared/types/api.types";
import ReviewForm from "./components/ReviewForm/ReviewForm";
import WriteReviewTitle from "./components/WriteReviewTitle/WriteReviewTitle";

interface WriteReviewProps {
  addReview: (reviewToAdd: Review) => void;
}

function WriteReview({ addReview }: WriteReviewProps) {
  return (
    <section className="flex flex-col gap-4">
      <WriteReviewTitle />
      <ReviewForm addReview={addReview} />
    </section>
  );
}

export default WriteReview;
