import type { SetURLSearchParams } from "react-router";

import AvailabilityFilter from "./components/AvailabilityFilter/AvailabilityFilter";
import BrandFilter from "./components/BrandFilter/BrandFilter";
import DiscountFilter from "./components/DiscountFilter/DiscountFilter";
import PriceFilter from "./components/PriceFilter/PriceFilter";
import RatingsFilter from "./components/RatingsFilter/RatingsFilter";

interface ProductFiltersProps {
  brands: string[];
  minPrice: number;
  maxPrice: number;
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
}

function ProductFilters({
  brands,
  minPrice,
  maxPrice,
  searchParams,
  setSearchParams,
}: ProductFiltersProps) {
  return (
    <div className="w-52 shrink-0 sticky flex flex-col gap-4 top-4">
      {/*
        Every filter block is an h3, so they need an h2 above them or the
        heading outline jumps from the page h1 straight to h3. Visually the
        sidebar already reads as filters, so this is screen reader only.
      */}
      <h2 className="sr-only">Filters</h2>
      <PriceFilter
        minPrice={minPrice}
        maxPrice={maxPrice}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <hr className="text-zinc-800" />
      <DiscountFilter
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <hr className="text-zinc-800" />
      <RatingsFilter
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <hr className="text-zinc-800" />
      <BrandFilter
        brands={brands}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <hr className="text-zinc-800" />
      <AvailabilityFilter
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
    </div>
  );
}

export default ProductFilters;
