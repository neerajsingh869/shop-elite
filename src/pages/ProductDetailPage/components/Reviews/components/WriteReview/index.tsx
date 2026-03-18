import ReviewForm from "./components/ReviewForm";
import WriteReviewTitle from "./components/WriteReviewTitle";

function WriteReview() {
  return (
    <section className="flex flex-col gap-4">
      <WriteReviewTitle />
      <ReviewForm />
    </section>
  );
}

export default WriteReview;
