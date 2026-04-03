import type { Filters } from "../../../../ProductListing";
import FilterTitle from "../FilterTitle/FilterTitle";
import ResetButton from "../ResetButton/ResetButton";

interface AvailabilityFilterProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

function AvailabilityFilter({ filters, setFilters }: AvailabilityFilterProps) {
  return (
    <section>
      <header className="flex justify-between items-center mb-3">
        <FilterTitle title="Availability" />
        <ResetButton
          resetFilter={() =>
            setFilters({
              ...filters,
              inStockOnly: false,
            })
          }
        />
      </header>
      <div className="flex items-center gap-2 py-1">
        <input
          id="in-stock-only-check"
          type="checkbox"
          checked={filters.inStockOnly}
          onChange={() => {
            console.log(filters);
            setFilters({
              ...filters,
              inStockOnly: !filters.inStockOnly,
            });
          }}
          className="accent-yellow-500 cursor-pointer w-3.5 h-3.5"
        />
        <label
          htmlFor="in-stock-only-check"
          className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
        >
          In stock only
        </label>
      </div>
    </section>
  );
}

export default AvailabilityFilter;
