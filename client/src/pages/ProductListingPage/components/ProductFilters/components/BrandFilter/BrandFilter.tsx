import type { Filters } from "../../../../ProductListing";
import FilterTitle from "../FilterTitle/FilterTitle";
import ResetButton from "../ResetButton/ResetButton";

interface BrandFilterProps {
  brands: string[];
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

function BrandFilter({ brands, filters, setFilters }: BrandFilterProps) {
  return (
    <section>
      <header className="flex justify-between items-center mb-3">
        <FilterTitle title="Brands" />
        <ResetButton
          resetFilter={() =>
            setFilters({
              ...filters,
              brands: [],
            })
          }
        />
      </header>
      {brands.map((brandName) => (
        <div key={brandName} className="flex items-center gap-2 py-1">
          <input
            id={`brand-${brandName}`}
            type="checkbox"
            checked={filters.brands.includes(brandName)}
            onChange={(e) => {
              console.log(e.target.value);
              console.log(e.target.checked);
              console.log(filters.brands);
              if (filters.brands.includes(brandName)) {
                setFilters((filters) => ({
                  ...filters,
                  brands: filters.brands.filter((brand) => brand !== brandName),
                }));
              } else {
                setFilters((filters) => ({
                  ...filters,
                  brands: [...filters.brands, brandName],
                }));
              }
            }}
            className="accent-yellow-500 cursor-pointer w-3.5 h-3.5"
          />
          <label
            htmlFor={`brand-${brandName}`}
            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
          >
            {brandName}
          </label>
        </div>
      ))}
    </section>
  );
}

export default BrandFilter;
