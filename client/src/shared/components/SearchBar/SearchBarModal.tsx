import { Link } from "react-router";
import { Search } from "lucide-react";
import { createPortal } from "react-dom";
import { useState, type SetStateAction } from "react";

import useSearch from "./useSearch";
import { ROUTES } from "../../constants";

interface SearchBarModalProps {
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
}

function SearchBarModal({ setIsOpen }: SearchBarModalProps) {
  const [query, setQuery] = useState("");

  const { products, filters, llmFailed, loading, error, hasSearched } =
    useSearch(query);

  return createPortal(
    <div
      className="fixed z-50 inset-0 backdrop-blur mx-2"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          setIsOpen(false);
        }
      }}
    >
      <div className="mx-auto flex flex-col justify-start items-center bg-neutral-900 mt-7.25 md:mt-32 max-w-2xl rounded-xl">
        <div
          className={`text-zinc-400 px-4 rounded-t-xl rounded-b-none border border-zinc-800 inline-flex flex-row items-center gap-2 w-full h-13 ${!hasSearched && !loading && query.length !== 0 && "rounded-b-xl"}`}
        >
          {!loading ? (
            <Search size={20} />
          ) : (
            <div className="animate-spin border-2 rounded-full h-5 w-5 border-zinc-800 border-t-zinc-400"></div>
          )}
          <input
            type="text"
            placeholder="Search"
            value={query}
            autoFocus
            onChange={(e) => setQuery(e.target.value)}
            className="outline-0 text-zinc-100 text-lg placeholder:text-zinc-400 flex-1 min-w-0"
          />
          <button
            className="border border-zinc-800 text-xs px-1.5 py-0.5 rounded-md flex justify-center items-center tracking-wide cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            esc
          </button>
        </div>
        <div
          className={`max-h-[460px] w-full overflow-auto transition-[height] duration-1000 rounded-b-xl border border-zinc-800 border-t-0 ${!hasSearched && !loading && query.length !== 0 && "border-b-0"}`}
        >
          {/* Case 1: Ideal (no query) */}
          {query.length === 0 ? (
            <div className="py-2 px-3 text-zinc-500 text-xs ">
              Try "apple phones under 1000 dollars" or "man shirts under 50
              dollars"
            </div>
          ) : // Case 2: Loading
          loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <article
                key={index}
                className="flex gap-2 h-24 p-2 border border-zinc-800 bg-zinc-950"
              >
                <div className="aspect-square bg-neutral-900 rounded-md animate-pulse"></div>
                <div className="w-full flex flex-col gap-2 justify-center">
                  <p className="animate-pulse w-2/3 h-6 bg-neutral-900"></p>
                  <div className="animate-pulse bg-neutral-900 h-4 w-32"></div>
                </div>
              </article>
            ))
          ) : // Case 3: Proper error
          error ? (
            <div>Error : {error}</div>
          ) : (
            // Case 4: llm failed (show llm failed error along with products)
            <>
              {llmFailed && (
                <div className="p-4 text-red-200 text-sm border-b border-b-zinc-800">
                  Smart search unavailable — showing keyword results
                  instead{" "}
                </div>
              )}
              {Object.keys(filters).length !== 0 && (
                <div className="flex flex-wrap justify-start gap-2 items-center text-zinc-400 p-4 border-b border-b-zinc-800">
                  {filters.keyword && (
                    <div className="text-xs text-zinc-500 bg-zinc-950 border rounded-full border-zinc-800 px-2 py-0.5 lowercase">
                      keyword: {filters.keyword}
                    </div>
                  )}
                  {filters.category && (
                    <div className="text-xs text-zinc-500 bg-zinc-950 border rounded-full border-zinc-800 px-2 py-0.5 lowercase">
                      category: {filters.category}
                    </div>
                  )}
                  {filters.brand && (
                    <div className="text-xs text-zinc-500 bg-zinc-950 border rounded-full border-zinc-800 px-2 py-0.5 lowercase">
                      brand: {filters.brand}
                    </div>
                  )}
                  {filters.minPrice && (
                    <div className="text-xs text-zinc-500 bg-zinc-950 border rounded-full border-zinc-800 px-2 py-0.5 lowercase">
                      min price: {filters.minPrice}
                    </div>
                  )}
                  {filters.maxPrice && (
                    <div className="text-xs text-zinc-500 bg-zinc-950 border rounded-full border-zinc-800 px-2 py-0.5 lowercase">
                      max price: {filters.maxPrice}
                    </div>
                  )}
                  {filters.minDiscount && (
                    <div className="text-xs text-zinc-500 bg-zinc-950 border rounded-full border-zinc-800 px-2 py-0.5 lowercase">
                      min discount: {filters.minDiscount}
                    </div>
                  )}
                  {filters.minRating && (
                    <div className="text-xs text-zinc-500 bg-zinc-950 border rounded-full border-zinc-800 px-2 py-0.5 lowercase">
                      min rating: {filters.minRating}
                    </div>
                  )}
                  {filters.availabilityStatus && (
                    <div className="text-xs text-zinc-500 bg-zinc-950 border rounded-full border-zinc-800 px-2 py-0.5 lowercase">
                      availability: {filters.availabilityStatus}
                    </div>
                  )}
                  {filters.sortBy && (
                    <div className="text-xs text-zinc-500 bg-zinc-950 border rounded-full border-zinc-800 px-2 py-0.5 lowercase">
                      sort: {filters.sortBy}
                    </div>
                  )}
                </div>
              )}
              {hasSearched && products.length === 0 && (
                <div className="px-4 h-44 flex flex-col justify-center items-center gap-4">
                  <div className="border-2 border-zinc-400 rounded-full h-5 w-5 flex items-center justify-center">
                    <div className="border-2 border-zinc-400 rounded-full h-3 w-3"></div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-zinc-400">No products found</p>
                    <p className="text-sm text-zinc-600">
                      Try broader terms or remove some filters
                    </p>
                  </div>
                </div>
              )}
              {products.length > 0 &&
                products.map((product) => (
                  <Link
                    key={product.id}
                    to={ROUTES.product(
                      product.category,
                      product.id,
                      product.title,
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <article className="group flex h-24 p-2 border border-zinc-800 bg-zinc-950 transition duration-300 hover:border-yellow-700/50 min-w-54">
                      <div className="aspect-square bg-neutral-900 rounded-md">
                        <img
                          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-115 p-3"
                          src={product.thumbnail}
                          alt={product.title}
                        />
                      </div>
                      <div className="py-2 px-3 flex flex-col gap-2 justify-center grow">
                        <p className="text-sm md:text-lg line-clamp-2 text-zinc-100">
                          {product.title}
                        </p>
                        <div className="flex gap-3 flex-wrap items-end text-xs md:text-sm">
                          <span className=" text-yellow-400 font-bold ">
                            ${product.price}
                          </span>
                          <span className="text-zinc-500 line-through">
                            $
                            {(
                              Number(product.price) /
                              (1 -
                                Math.round(Number(product.discountPercentage)) /
                                  100)
                            ).toFixed(2)}
                          </span>
                          <span className="text-emerald-400 bg-emerald-900/20 border border-emerald-800/40 text-[10px] rounded font-semibold uppercase px-2 py-0.5">
                            -{Math.round(Number(product.discountPercentage))}%
                            off
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default SearchBarModal;
