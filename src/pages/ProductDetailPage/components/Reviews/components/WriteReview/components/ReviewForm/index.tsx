import { Star } from "lucide-react";

function ReviewForm() {
  return (
    <form className="flex flex-col gap-4 items-start">
      <div className="flex flex-col gap-2 w-full">
        <label htmlFor="rating-input" className="text-sm text-zinc-400">
          Rating <span className="text-xs text-zinc-500">(required)</span>
        </label>
        <div id="rating-input" className="flex gap-1">
          {[1, 2, 3, 4, 5].map((num) => {
            // if (num <= Math.ceil(reviewInfo.rating)) {
            //   return (
            //     <Star
            //       key={num}
            //       size={12}
            //       fill="oklch(85.2% 0.199 91.936)"
            //       color="oklch(85.2% 0.199 91.936)"
            //       strokeWidth={1.5}
            //     />
            //   );
            // }
            // return (
            //   <Star
            //     key={num}
            //     size={12}
            //     fill="oklch(55.2% 0.016 285.938)"
            //     color="oklch(55.2% 0.016 285.938)"
            //     strokeWidth={1.5}
            //   />
            // );
            return (
              <Star
                key={num}
                size={24}
                fill="oklch(55.2% 0.016 285.938)"
                color="oklch(55.2% 0.016 285.938)"
                strokeWidth={1.5}
              />
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <label htmlFor="review-input" className="text-sm text-zinc-400">
          Write a review{" "}
          <span className="text-xs text-zinc-500">(required)</span>
        </label>
        <textarea
          id="review-input"
          rows={4}
          className="border border-zinc-800 rounded-md p-2"
          required
        ></textarea>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <label htmlFor="review-title-input" className="text-sm text-zinc-400">
          Title your review{" "}
          <span className="text-xs text-zinc-500">(required)</span>
        </label>
        <input
          id="review-title-input"
          type="text"
          className="border border-zinc-800 rounded-md h-10 p-2"
          required
        />
      </div>
      <button className="self-end border bg-yellow-500 text-black font-semibold text-sm py-2 px-6 rounded-lg transition duration-300 hover:-translate-y-0.5 hover:bg-yellow-400 cursor-pointer">
        Submit
      </button>
    </form>
  );
}

export default ReviewForm;
