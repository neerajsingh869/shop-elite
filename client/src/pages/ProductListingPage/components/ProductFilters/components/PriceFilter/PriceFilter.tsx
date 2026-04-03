import type { Filters } from "../../../../ProductListing";
import FilterTitle from "../FilterTitle/FilterTitle";
import ResetButton from "../ResetButton/ResetButton";

interface PriceFilterProps {
  minPrice: number;
  maxPrice: number;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

function PriceFilter({
  minPrice,
  maxPrice,
  filters,
  setFilters,
}: PriceFilterProps) {
  return (
    <section>
      <header className="flex justify-between items-center mb-3">
        <FilterTitle title="Price" />
        <ResetButton
          resetFilter={() =>
            setFilters({
              ...filters,
              priceRange: {
                min: minPrice,
                max: maxPrice,
              },
            })
          }
        />
      </header>
      <div>
        <input
          className="w-full accent-yellow-500 cursor-pointer"
          type="range"
          value={filters.priceRange.min}
          min={minPrice}
          max={maxPrice}
          onChange={(e) => {
            console.log(e.target.value);
            console.log(filters);
            setFilters({
              ...filters,
              priceRange: {
                ...filters.priceRange,
                min: Number(e.target.value),
              },
            });
          }}
        />
      </div>
      <div className="flex justify-between text-xs text-zinc-400 mt-1">
        <span>From ${filters.priceRange.min}</span>
        <span>To ${filters.priceRange.max}</span>
      </div>
    </section>
  );
}

export default PriceFilter;
