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
