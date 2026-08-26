import type { SetURLSearchParams } from "react-router";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  setSearchParams: SetURLSearchParams;
}

/*
  Pulled out of AllProducts and ProductListing - both had the same block of
  bare numbered buttons sitting loose in a div, with no way to tell which page
  you were on other than nothing at all.
*/
function Pagination({
  totalPages,
  currentPage,
  setSearchParams,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    /*
      nav so it shows up as a landmark and can be jumped to, ul so the page
      count is announced ("list, 5 items") instead of five unrelated buttons,
      and aria-current="page" so the active one is spoken as current.
    */
    <nav aria-label="Pagination" className="flex justify-center mt-3">
      <ul className="flex gap-2">
        {Array.from({ length: totalPages }).map((_, index) => {
          const pageNumber = index + 1;
          const isCurrentPage = pageNumber === currentPage;

          return (
            <li key={pageNumber}>
              <button
                onClick={() =>
                  setSearchParams((prev) => {
                    const next = new URLSearchParams(prev);
                    next.set("page", String(pageNumber));
                    return next;
                  })
                }
                aria-label={`Go to page ${pageNumber}`}
                aria-current={isCurrentPage ? "page" : undefined}
                className={`cursor-pointer rounded font-semibold px-2.5 py-0.5 border ${
                  isCurrentPage
                    ? "bg-emerald-400 text-zinc-950 border-emerald-400"
                    : "text-emerald-400 bg-emerald-900/20 border-emerald-800/40"
                }`}
              >
                {pageNumber}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default Pagination;
