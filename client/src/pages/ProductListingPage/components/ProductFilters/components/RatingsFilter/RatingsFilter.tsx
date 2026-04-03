import type { Filters } from "../../../../ProductListing";
import FilterTitle from "../FilterTitle/FilterTitle";
import ResetButton from "../ResetButton/ResetButton";

interface RatingsFilterProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

function RatingsFilter({ filters, setFilters }: RatingsFilterProps) {
  return (
    <section>
      <header className="flex justify-between items-center mb-3">
        <FilterTitle title="Ratings" />
        <ResetButton
          resetFilter={() =>
            setFilters({
              ...filters,
              minRating: 0,
            })
          }
        />
      </header>
      {[4.5, 4, 3.5, 3].map((ratingValue) => (
        <div key={ratingValue} className="flex items-center gap-2 py-1">
          <input
            id={`rating-${ratingValue}+`}
            type="radio"
            checked={filters.minRating === ratingValue}
            onChange={(e) => {
              console.log(e.target.value);
              setFilters((prev) => ({
                ...prev,
                minRating: ratingValue,
              }));
            }}
            value={ratingValue}
            className="accent-yellow-500 cursor-pointer w-3.5 h-3.5"
          />
          <label
            htmlFor={`rating-${ratingValue}+`}
            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
          >
            {ratingValue}* & up
          </label>
        </div>
      ))}
    </section>
  );
}

export default RatingsFilter;
