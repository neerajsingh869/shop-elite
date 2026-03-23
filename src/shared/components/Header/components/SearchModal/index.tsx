import { Link } from "react-router";
import React, { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

import type { ProductResponse } from "../../../../types/api.types";

import ProductCard from "./components/ProductCard";
import getCategoryName from "../../../../utils/getCategoryName";
import { getSearchUrlForProducts, ROUTES } from "../../../../constants";

interface SearchModalProps {
  setShowSearchModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function SearchModal({ setShowSearchModal }: SearchModalProps) {
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<ProductResponse | null>(
    null,
  );
  const [allCategories, setAllCategories] = useState<string[] | null>(null);
  const [showSearchResponse, setShowSearchResponse] = useState(false);

  const [loading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setIsLoading(true);

    const controller = new AbortController();

    async function fetchCategories() {
      try {
        const response = await fetch(
          "https://dummyjson.com/products/category-list",
          { signal: controller.signal },
        );
        const jsonData = await response.json();
        setAllCategories(jsonData);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchCategories();

    return () => controller.abort();
  }, []);

  async function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchInput(event.target.value);
    if (event.target.value.length === 0) {
      setShowSearchResponse(false);
    } else {
      setShowSearchResponse(true);
    }

    setIsLoading(true);
    // cancel previous request
    controllerRef.current?.abort();
    controllerRef.current = new AbortController();

    try {
      const response = await fetch(
        getSearchUrlForProducts(event.target.value.trim()),
        { signal: controllerRef.current?.signal },
      );

      if (!response.ok) {
        throw new Error(`Request failed with Status ${response.status}`);
      }

      const jsonData = await response.json();

      setSearchResults(jsonData);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;

      setSearchError(err instanceof Error ? err.message : "Search failed");
    } finally {
      if (!controllerRef.current?.signal.aborted) {
        setIsLoading(false);
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-zinc-950/50 z-50 overflow-auto">
      <div className="w-full border-b border-b-zinc-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto py-8 px-4 md:py-16 md:px-10 bg-zinc-950 flex justify-center items-center">
          <div className="border-2 bg-zinc-800 py-3.5 pl-4 border-zinc-800 border-r-0 rounded-l-xl">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Search"
            className="border-2 bg-zinc-800 border-zinc-800 w-full py-3 px-4 border-x-0 outline-0"
            value={searchInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleSearch(e);
            }}
          />
          <div className="border-2 bg-zinc-800 py-3.5 pr-4 border-zinc-800 border-l-0 rounded-r-xl">
            <X
              size={20}
              className="cursor-pointer"
              onClick={() => setShowSearchModal(false)}
            />
          </div>
        </div>
      </div>
      {searchError && <p className="text-red-400 text-sm">{searchError}</p>}
      {!loading && showSearchResponse && (
        <div className="w-full border-b border-b-zinc-800">
          <div className="max-w-7xl mx-auto bg-zinc-950 min-h-[25vh] flex flex-col items-center justify-center p-8 overflow-hidden">
            {searchResults && searchResults.products.length ? (
              <div className="flex flex-col sm:flex-row justify-around gap-12 mb-8">
                <section className="flex flex-col w-32 gap-4 sm:gap-8">
                  <h1 className="text-zinc-100 w-full border-b border-b-zinc-800 pb-2">
                    Categories
                  </h1>
                  <div className="flex flex-col gap-2">
                    {allCategories!
                      .filter((categorySlug) =>
                        categorySlug
                          .toLowerCase()
                          .includes(searchInput.toLowerCase()),
                      )
                      .map((categorySlug) => (
                        <Link
                          key={categorySlug}
                          to={ROUTES.category(categorySlug)}
                          onClick={() => setShowSearchModal(false)}
                        >
                          <span className="underline cursor-pointer text-sm text-zinc-400 transition-all duration-500 hover:text-zinc-100 hover:-translate-y-0.25 inline-block">
                            {getCategoryName(categorySlug)}
                          </span>
                        </Link>
                      ))}
                  </div>
                </section>
                <section className="flex flex-col gap-4 sm:gap-8">
                  <h1 className="text-zinc-100 w-full border-b border-b-zinc-800 pb-2">
                    Products
                  </h1>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                    {searchResults.products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        setShowSearchModal={setShowSearchModal}
                      />
                    ))}
                  </div>
                </section>
              </div>
            ) : (
              <div className="text-center mb-8">
                <p className="text-zinc-100">
                  No results found for “{searchInput}”
                </p>
                <p className="text-zinc-500 text-sm">
                  Check the spelling or use a different word or phrase
                </p>
              </div>
            )}
            {/* <button className="cursor-pointer self-center bg-yellow-500 text-black font-semibold text-sm h-12 shrink-0 px-6 rounded-lg transition duration-300 hover:-translate-y-0.5 hover:bg-yellow-400 mb-6">
              Search for "{searchInput}"
            </button> */}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchModal;
