import type { Filters } from "../../ProductListing";
import AvailabilityFilter from "./components/AvailabilityFilter/AvailabilityFilter";
import BrandFilter from "./components/BrandFilter/BrandFilter";
import DiscountFilter from "./components/DiscountFilter/DiscountFilter";
import PriceFilter from "./components/PriceFilter/PriceFilter";
import RatingsFilter from "./components/RatingsFilter/RatingsFilter";

interface ProductFiltersProps {
  brands: string[];
  minPrice: number;
  maxPrice: number;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

function ProductFilters({
  brands,
  minPrice,
  maxPrice,
  filters,
  setFilters,
}: ProductFiltersProps) {
  console.log(minPrice, maxPrice);
  return (
    <div className="w-52 shrink-0 sticky flex flex-col gap-4">
      <PriceFilter
        minPrice={minPrice}
        maxPrice={maxPrice}
        filters={filters}
        setFilters={setFilters}
      />
      <hr className="text-zinc-800" />
      <DiscountFilter filters={filters} setFilters={setFilters} />
      <hr className="text-zinc-800" />
      <RatingsFilter filters={filters} setFilters={setFilters} />
      <hr className="text-zinc-800" />
      <BrandFilter brands={brands} filters={filters} setFilters={setFilters} />
      <hr className="text-zinc-800" />
      <AvailabilityFilter filters={filters} setFilters={setFilters} />
    </div>
  );
}

export default ProductFilters;
