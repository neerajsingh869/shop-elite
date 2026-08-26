import type { SetURLSearchParams } from "react-router";

import FilterTitle from "../FilterTitle/FilterTitle";
import ResetButton from "../ResetButton/ResetButton";
import { useState } from "react";

interface PriceFilterProps {
  minPrice: number;
  maxPrice: number;
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
}

function PriceFilter({
  minPrice,
  maxPrice,
  searchParams,
  setSearchParams,
}: PriceFilterProps) {
  const [sliderValue, setSliderValue] = useState(
    Number(searchParams.get("minPrice") || minPrice),
  );

  return (
    <section aria-labelledby="filter-price">
      <header className="flex justify-between items-center mb-3">
        <FilterTitle id="filter-price" title="Price" />
        <ResetButton
          label="Reset price filter"
          resetFilter={() =>
            setSearchParams((prev) => {
              const next = new URLSearchParams(prev);
              next.delete("minPrice");
              next.delete("maxPrice");
              if (next.has("page")) {
                next.set("page", "1");
              }
              return next;
            })
          }
        />
      </header>
      <div>
        {/*
          This slider had no label of any kind - it announced as just "slider".
          aria-valuetext matters too: without it a screen reader reads the raw
          number ("450"), with it you hear "$450".
        */}
        <input
          className="w-full accent-yellow-500 cursor-pointer"
          type="range"
          aria-label="Minimum price"
          aria-valuetext={`$${sliderValue}`}
          value={sliderValue}
          min={minPrice}
          max={maxPrice}
          onChange={(e) => setSliderValue(Number(e.target.value))}
          onPointerUp={(e) => {
            setSearchParams((prev) => {
              const next = new URLSearchParams(prev);
              next.set("minPrice", e.currentTarget.value);
              return next;
            });
          }}
          /*
            Keyboard users never fire pointerup, so before this the slider
            could be moved with the arrow keys but the filter never applied.
          */
          onKeyUp={(e) => {
            setSearchParams((prev) => {
              const next = new URLSearchParams(prev);
              next.set("minPrice", e.currentTarget.value);
              return next;
            });
          }}
        />
      </div>
      <div className="flex justify-between text-xs text-zinc-400 mt-1">
        <span>From ${searchParams.get("minPrice") ?? 0}</span>
        <span>To ${searchParams.get("maxPrice") ?? maxPrice}</span>
      </div>
    </section>
  );
}

export default PriceFilter;
