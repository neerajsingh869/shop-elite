import type { SetURLSearchParams } from "react-router";

import FilterTitle from "../FilterTitle/FilterTitle";
import ResetButton from "../ResetButton/ResetButton";

interface RatingsFilterProps {
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
}

function RatingsFilter({ searchParams, setSearchParams }: RatingsFilterProps) {
  return (
    <section aria-labelledby="filter-ratings">
      <header className="flex justify-between items-center mb-3">
        <FilterTitle id="filter-ratings" title="Ratings" />
        <ResetButton
          label="Reset ratings filter"
          resetFilter={() =>
            setSearchParams((prev) => {
              const next = new URLSearchParams(prev);
              next.delete("minRating");
              if (next.has("page")) {
                next.set("page", "1");
              }
              return next;
            })
          }
        />
      </header>
      {/* radiogroup so the options are announced as "1 of 4" and share a name */}
      <div role="radiogroup" aria-labelledby="filter-ratings">
        {[4.5, 4, 3.5, 3].map((ratingValue) => (
          <div key={ratingValue} className="flex items-center gap-2 py-1">
            <input
              id={`rating-${ratingValue}+`}
              type="radio"
              checked={Number(searchParams.get("minRating")) === ratingValue}
              onChange={() => {
                setSearchParams((prev) => {
                  const next = new URLSearchParams(prev);
                  next.set("minRating", String(ratingValue));
                  return next;
                });
              }}
              value={ratingValue}
              className="accent-yellow-500 cursor-pointer w-3.5 h-3.5"
            />
            {/* was "4.5* & up", which a screen reader reads as "asterisk" */}
            <label
              htmlFor={`rating-${ratingValue}+`}
              className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
            >
              {ratingValue} stars & up
            </label>
          </div>
        ))}
      </div>
    </section>
  );
}

export default RatingsFilter;
