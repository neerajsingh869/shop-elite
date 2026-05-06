import type { SetURLSearchParams } from "react-router";

import FilterTitle from "../FilterTitle/FilterTitle";
import ResetButton from "../ResetButton/ResetButton";

interface BrandFilterProps {
  brands: string[];
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
}

function BrandFilter({
  brands,
  searchParams,
  setSearchParams,
}: BrandFilterProps) {
  return (
    <section>
      <header className="flex justify-between items-center mb-3">
        <FilterTitle title="Brands" />
        <ResetButton
          resetFilter={() =>
            setSearchParams((prev) => {
              const next = new URLSearchParams(prev);
              next.delete("brand");
              if (next.has("page")) {
                next.set("page", "1");
              }
              return next;
            })
          }
        />
      </header>
      {brands.map((brandName) => (
        <div key={brandName} className="flex items-center gap-2 py-1">
          <input
            id={`brand-${brandName}`}
            type="checkbox"
            checked={searchParams.getAll("brand")?.includes(brandName)}
            onChange={() => {
              if (searchParams.getAll("brand")?.includes(brandName)) {
                setSearchParams((prev) => {
                  const next = new URLSearchParams(prev);
                  next.delete("brand");
                  for (const brand of prev.getAll("brand")) {
                    if (brand !== brandName) {
                      next.append("brand", brand);
                    }
                  }
                  return next;
                });
              } else {
                setSearchParams((prev) => {
                  const next = new URLSearchParams(prev);
                  next.append("brand", brandName);
                  return next;
                });
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
