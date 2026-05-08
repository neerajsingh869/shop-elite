import { useSearchParams } from "react-router";

import { getAllProductsURL } from "../../shared/constants";
import useFetch from "../../shared/hooks/useFetch";
import type { ProductResponse } from "../../shared/types/api.types";
import ProductListingGridSkeleton from "../ProductListingPage/components/ProductGrid/ProductGridSkeleton";
import ProductGrid from "../ProductListingPage/components/ProductGrid/ProductGrid";

function AllProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, loading, error } = useFetch<ProductResponse>(
    getAllProductsURL(
      Number(searchParams.get("page") ?? 1),
      Number(searchParams.get("limit") ?? 12),
    ),
  );
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return (
    <>
      {loading ? (
        <ProductListingGridSkeleton />
      ) : data && data.total ? (
        <div>
          <ProductGrid products={data.products} source="ALL_PRODUCTS" />
          <div className="flex justify-center gap-2 mt-3">
            {data.totalPages &&
              data.totalPages > 1 &&
              Array.from({ length: data.totalPages }).map((_, index) => (
                <button
                  key={index}
                  className="cursor-pointer text-emerald-400 bg-emerald-900/20 border border-emerald-800/40 rounded text font-semibold px-2.5 py-0.5"
                  onClick={() =>
                    setSearchParams((prev) => {
                      const next = new URLSearchParams(prev);
                      next.set("page", String(index + 1));
                      return next;
                    })
                  }
                >
                  {index + 1}
                </button>
              ))}
          </div>
        </div>
      ) : (
        <div className="mt-32 mx-auto">
          <div className="flex flex-col items-center">
            <span className="text-xl md:text-2xl lg:text-3xl font-bold text-zinc-100 text-center">
              No products found
            </span>
            <span className="text-zinc-500 text-sm lg:text-base text-center">
              Use fewer filters or{" "}
              <button
                onClick={() => setSearchParams({})}
                className="underline cursor-pointer"
              >
                clear all
              </button>
            </span>
          </div>
        </div>
      )}
    </>
  );
}

export default AllProducts;
