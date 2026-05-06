import type { SetURLSearchParams } from "react-router";

import FilterTitle from "../FilterTitle/FilterTitle";
import ResetButton from "../ResetButton/ResetButton";

interface DiscountFilterProps {
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
}

function DiscountFilter({
  searchParams,
  setSearchParams,
}: DiscountFilterProps) {
  return (
    <section>
      <header className="flex justify-between items-center mb-3">
        <FilterTitle title="Discounts (in %)" />
        <ResetButton
          resetFilter={() =>
            setSearchParams((prev) => {
              const next = new URLSearchParams(prev);
              next.delete("minDiscount");
              if (next.has("page")) {
                next.set("page", "1");
              }
              return next;
            })
          }
        />
      </header>
      {[70, 50, 30, 10].map((discountValue) => (
        <div key={discountValue} className="flex items-center gap-2 py-1">
          <input
            id={`discount-${discountValue}+`}
            type="radio"
            checked={Number(searchParams.get("minDiscount")) === discountValue}
            onChange={() => {
              setSearchParams((prev) => {
                const next = new URLSearchParams(prev);
                next.set("minDiscount", String(discountValue));
                return next;
              });
            }}
            value={discountValue}
            className="accent-yellow-500 cursor-pointer w-3.5 h-3.5"
          />
          <label
            htmlFor={`discount-${discountValue}+`}
            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
          >
            {discountValue}% & up
          </label>
        </div>
      ))}
    </section>
  );
}

export default DiscountFilter;
