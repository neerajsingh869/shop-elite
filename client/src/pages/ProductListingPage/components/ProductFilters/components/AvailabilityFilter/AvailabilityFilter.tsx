import type { SetURLSearchParams } from "react-router";

import FilterTitle from "../FilterTitle/FilterTitle";
import ResetButton from "../ResetButton/ResetButton";

interface AvailabilityFilterProps {
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
}

function AvailabilityFilter({
  searchParams,
  setSearchParams,
}: AvailabilityFilterProps) {
  return (
    <section>
      <header className="flex justify-between items-center mb-3">
        <FilterTitle title="Availability" />
        <ResetButton
          resetFilter={() =>
            setSearchParams((prev) => {
              const next = new URLSearchParams(prev);
              next.delete("availabilityStatus");
              if (next.has("page")) {
                next.set("page", "1");
              }
              return next;
            })
          }
        />
      </header>
      <div className="flex items-center gap-2 py-1">
        <input
          id="in-stock-only-check"
          type="checkbox"
          checked={searchParams.get("availabilityStatus") === "In Stock"}
          onChange={() => {
            setSearchParams((prev) => {
              const next = new URLSearchParams(prev);
              if (prev.has("availabilityStatus")) {
                next.delete("availabilityStatus");
              } else {
                next.set("availabilityStatus", "In Stock");
              }
              return next;
            });
          }}
          className="accent-yellow-500 cursor-pointer w-3.5 h-3.5"
        />
        <label
          htmlFor="in-stock-only-check"
          className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
        >
          In Stock only
        </label>
      </div>
    </section>
  );
}

export default AvailabilityFilter;
