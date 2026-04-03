import type { Filters } from "../../../../ProductListing";
import FilterTitle from "../FilterTitle/FilterTitle";
import ResetButton from "../ResetButton/ResetButton";

interface DiscountFilterProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

function DiscountFilter({ filters, setFilters }: DiscountFilterProps) {
  return (
    <section>
      <header className="flex justify-between items-center mb-3">
        <FilterTitle title="Discounts (in %)" />
        <ResetButton
          resetFilter={() =>
            setFilters({
              ...filters,
              minDiscount: 0,
            })
          }
        />
      </header>
      {[70, 50, 30, 10].map((discountValue) => (
        <div key={discountValue} className="flex items-center gap-2 py-1">
          <input
            id={`discount-${discountValue}+`}
            type="radio"
            checked={filters.minDiscount === discountValue}
            onChange={(e) => {
              console.log(e.target.value);
              setFilters({
                ...filters,
                minDiscount: discountValue,
              });
            }}
            value={discountValue}
            className="accent-yellow-500 cursor-pointer w-3.5 h-3.5"
          />
          <label htmlFor={`discount-${discountValue}+`} className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer">
            {discountValue}% & up
          </label>
        </div>
      ))}
    </section>
  );
}

export default DiscountFilter;
