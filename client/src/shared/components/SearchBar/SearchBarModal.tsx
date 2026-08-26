import { useNavigate } from "react-router";
import { Search } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type SetStateAction,
} from "react";

import useSearch from "./useSearch";
import { ROUTES } from "../../constants";
import Modal from "../ui/Modal";

interface SearchBarModalProps {
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
}

function SearchBarModal({ setIsOpen }: SearchBarModalProps) {
  const [query, setQuery] = useState("");
  // -1 means "nothing highlighted", the input itself holds the caret
  const [activeIndex, setActiveIndex] = useState(-1);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();

  const {
    state: {
      products,
      filters,
      llmFailed,
      loading,
      loadingMore,
      error,
      hasSearched,
      hasMore,
    },
    loadMore,
  } = useSearch(query);

  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // `hasMore` so that we can avoid extra fetch request when
        // we already have fetched entire results from backend
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMore();
        }
      },
      {
        root: scrollContainerRef.current,
      },
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [loadMore, hasMore, loadingMore, products.length]);

  const activeOptionId =
    activeIndex >= 0 && products[activeIndex]
      ? `search-option-${products[activeIndex].id}`
      : undefined;

  function goToProduct(product: (typeof products)[number]) {
    navigate(
      ROUTES.product("SEARCH", product.id, product.title, product.category),
    );
    setIsOpen(false);
  }

  /*
    The listbox is driven entirely from the input using aria-activedescendant:
    focus never leaves the text field, we just tell the screen reader which
    option is "active". The alternative (moving real DOM focus into the list)
    would fight with typing, which is why the APG combobox pattern works this
    way. Options therefore do not need to be focusable or have key handlers.
  */
  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (products.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % products.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) =>
        prev <= 0 ? products.length - 1 : prev - 1,
      );
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      goToProduct(products[activeIndex]);
    }
  }

  // keep the highlighted option scrolled into view as you arrow through
  useEffect(() => {
    if (!activeOptionId) return;

    document
      .getElementById(activeOptionId)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeOptionId]);

  const showResultsPanel = !hasSearched && !loading && query.length !== 0;

  return (
    <Modal
      isOpen
      onClose={() => setIsOpen(false)}
      label="Search products"
      backdropClassName="fixed z-50 inset-0 backdrop-blur mx-2"
      className="mx-auto flex flex-col justify-start items-center bg-neutral-900 mt-7.25 md:mt-32 max-w-2xl rounded-xl"
    >
      <div
        className={`text-zinc-400 px-4 rounded-t-xl rounded-b-none border border-zinc-800 inline-flex flex-row items-center gap-2 w-full h-13 ${showResultsPanel && "rounded-b-xl"}`}
      >
        {!loading ? (
          <Search size={20} aria-hidden="true" />
        ) : (
          <div
            aria-hidden="true"
            className="animate-spin border-2 rounded-full h-5 w-5 border-zinc-800 border-t-zinc-400"
          ></div>
        )}
        {/*
          Modal moves focus to the first focusable child, which is this input -
          so the old autoFocus is gone. autoFocus is also a jsx-a11y warning
          because on a page (rather than in a dialog) it yanks people around.
        */}
        <input
          type="text"
          role="combobox"
          aria-label="Search products"
          aria-expanded={products.length > 0}
          aria-controls="search-results"
          aria-autocomplete="list"
          aria-activedescendant={activeOptionId}
          placeholder="Search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            // a new set of results invalidates whatever was highlighted
            setActiveIndex(-1);
          }}
          onKeyDown={handleInputKeyDown}
          className="text-zinc-100 text-lg placeholder:text-zinc-400 flex-1 min-w-0"
        />
        <button
          className="border border-zinc-800 text-xs px-1.5 py-0.5 rounded-md flex justify-center items-center tracking-wide cursor-pointer"
          onClick={() => setIsOpen(false)}
          aria-label="Close search"
        >
          <span aria-hidden="true">esc</span>
        </button>
      </div>

      {/*
        Result count for screen readers. Sighted users can see the list grow;
        without this a screen reader user types and hears nothing back.
      */}
      <div className="sr-only" role="status" aria-live="polite">
        {hasSearched && !loading
          ? `${products.length} ${products.length === 1 ? "result" : "results"}`
          : ""}
      </div>

      <div
        ref={scrollContainerRef}
        className={`max-h-[460px] w-full overflow-auto transition-[height] duration-1000 rounded-b-xl border border-zinc-800 border-t-0 ${showResultsPanel && "border-b-0"}`}
      >
        {/* Case 1: Ideal (no query) */}
        {query.length === 0 ? (
          <div className="py-2 px-3 text-zinc-400 text-xs ">
            Try "apple phones under 1000 dollars" or "man shirts under 50
            dollars"
          </div>
        ) : // Case 2: Loading
        loading ? (
          <div role="status">
            <span className="sr-only">Searching…</span>
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                aria-hidden="true"
                className="flex gap-2 h-24 p-2 border border-zinc-800 bg-zinc-950"
              >
                <div className="aspect-square bg-neutral-900 rounded-md animate-pulse"></div>
                <div className="w-full flex flex-col gap-2 justify-center">
                  <p className="animate-pulse w-2/3 h-6 bg-neutral-900"></p>
                  <div className="animate-pulse bg-neutral-900 h-4 w-32"></div>
                </div>
              </div>
            ))}
          </div>
        ) : // Case 3: Proper error
        error ? (
          <div role="alert" className="p-4 text-red-200 text-sm">
            Error : {error}
          </div>
        ) : (
          // Case 4: llm failed (show llm failed error along with products)
          <>
            {llmFailed && (
              <div
                role="status"
                className="p-4 text-red-200 text-sm border-b border-b-zinc-800"
              >
                Smart search unavailable — showing keyword results instead{" "}
              </div>
            )}
            {Object.keys(filters).length !== 0 && (
              <div className="flex flex-wrap justify-start gap-2 items-center text-zinc-400 p-4 border-b border-b-zinc-800">
                {filters.keyword && (
                  <div className="text-xs text-zinc-400 bg-zinc-950 border rounded-full border-zinc-800 px-2 py-0.5 lowercase">
                    keyword: {filters.keyword}
                  </div>
                )}
                {filters.category && (
                  <div className="text-xs text-zinc-400 bg-zinc-950 border rounded-full border-zinc-800 px-2 py-0.5 lowercase">
                    category: {filters.category}
                  </div>
                )}
                {filters.brand && (
                  <div className="text-xs text-zinc-400 bg-zinc-950 border rounded-full border-zinc-800 px-2 py-0.5 lowercase">
                    brand: {filters.brand}
                  </div>
                )}
                {filters.minPrice && (
                  <div className="text-xs text-zinc-400 bg-zinc-950 border rounded-full border-zinc-800 px-2 py-0.5 lowercase">
                    min price: {filters.minPrice}
                  </div>
                )}
                {filters.maxPrice && (
                  <div className="text-xs text-zinc-400 bg-zinc-950 border rounded-full border-zinc-800 px-2 py-0.5 lowercase">
                    max price: {filters.maxPrice}
                  </div>
                )}
                {filters.minDiscount && (
                  <div className="text-xs text-zinc-400 bg-zinc-950 border rounded-full border-zinc-800 px-2 py-0.5 lowercase">
                    min discount: {filters.minDiscount}
                  </div>
                )}
                {filters.minRating && (
                  <div className="text-xs text-zinc-400 bg-zinc-950 border rounded-full border-zinc-800 px-2 py-0.5 lowercase">
                    min rating: {filters.minRating}
                  </div>
                )}
                {filters.availabilityStatus && (
                  <div className="text-xs text-zinc-400 bg-zinc-950 border rounded-full border-zinc-800 px-2 py-0.5 lowercase">
                    availability: {filters.availabilityStatus}
                  </div>
                )}
                {filters.sortBy && (
                  <div className="text-xs text-zinc-400 bg-zinc-950 border rounded-full border-zinc-800 px-2 py-0.5 lowercase">
                    sort: {filters.sortBy}
                  </div>
                )}
              </div>
            )}
            {hasSearched && products.length === 0 && (
              <div className="px-4 h-44 flex flex-col justify-center items-center gap-4">
                <div
                  aria-hidden="true"
                  className="border-2 border-zinc-400 rounded-full h-5 w-5 flex items-center justify-center"
                >
                  <div className="border-2 border-zinc-400 rounded-full h-3 w-3"></div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-zinc-400">No products found</p>
                  <p className="text-sm text-zinc-400">
                    Try broader terms or remove some filters
                  </p>
                </div>
              </div>
            )}
            <ul id="search-results" role="listbox" aria-label="Search results">
              {products.map((product, index) => (
                /*
                  eslint-disable-next-line jsx-a11y/click-events-have-key-events --
                  Options in an aria-activedescendant combobox are not focusable
                  by design; all keyboard handling lives on the input above.
                */
                <li
                  key={product.id}
                  id={`search-option-${product.id}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  onClick={() => goToProduct(product)}
                  className={`group flex h-24 p-2 border bg-zinc-950 transition duration-300 min-w-54 cursor-pointer ${index === activeIndex ? "border-yellow-600" : "border-zinc-800 hover:border-yellow-700/50"}`}
                >
                  <div className="aspect-square bg-neutral-900 rounded-md">
                    <img
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-115 p-3"
                      src={product.thumbnail}
                      alt=""
                    />
                  </div>
                  <div className="py-2 px-3 flex flex-col gap-2 justify-center grow">
                    <p className="text-sm md:text-lg line-clamp-2 text-zinc-100">
                      {product.title}
                    </p>
                    <div className="flex gap-3 flex-wrap items-end text-xs md:text-sm">
                      <span className=" text-yellow-400 font-bold ">
                        ${Number(product.price).toFixed(2)}
                      </span>
                      <span className="text-zinc-400 line-through">
                        <span className="sr-only">was </span>$
                        {(
                          Number(product.price) /
                          (1 -
                            Math.round(Number(product.discountPercentage)) / 100)
                        ).toFixed(2)}
                      </span>
                      <span className="text-emerald-400 bg-emerald-900/20 border border-emerald-800/40 text-[10px] rounded font-semibold uppercase px-2 py-0.5">
                        -{Math.round(Number(product.discountPercentage))}% off
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {/* Sentinel only when there are products */}
            {products.length > 0 && <div ref={sentinelRef} />}
            {loadingMore && (
              <div role="status">
                <span className="sr-only">Loading more results…</span>
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    aria-hidden="true"
                    className="flex gap-2 h-24 p-2 border border-zinc-800 bg-zinc-950"
                  >
                    <div className="aspect-square bg-neutral-900 rounded-md animate-pulse"></div>
                    <div className="w-full flex flex-col gap-2 justify-center">
                      <p className="animate-pulse w-2/3 h-6 bg-neutral-900"></p>
                      <div className="animate-pulse bg-neutral-900 h-4 w-32"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}

export default SearchBarModal;
