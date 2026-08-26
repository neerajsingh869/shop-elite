import { useSearchParams } from "react-router";

import { getAllProductsURL, ROUTES } from "../../shared/constants";
import useFetch from "../../shared/hooks/useFetch";
import type { ProductResponse } from "../../shared/types/api.types";
import ProductListingGridSkeleton from "../ProductListingPage/components/ProductGrid/ProductGridSkeleton";
import BackButton from "../../shared/components/ui/BackButton";
import useScrollToTop from "../../shared/hooks/useScrollToTop";
import useDocumentTitle from "../../shared/hooks/useDocumentTitle";
import ProductCard from "../ProductListingPage/components/ProductGrid/components/ProductCard/ProductCard";
import VirtualGrid from "../../shared/components/VirtualGrid/VirtualGrid";

function AllProducts() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { data, loading, error } = useFetch<ProductResponse>(
    getAllProductsURL(
      Number(searchParams.get("page") ?? 1),
      Number(searchParams.get("limit") ?? 100),
    ),
  );
  const { topRef } = useScrollToTop(loading);

  useDocumentTitle("All Products");

  return (
    <>
      <div className="absolute top-0" ref={topRef}></div>
      <BackButton to={ROUTES.home} label="All Categories" />
      <header className="mb-6">
        <p className="text-xs text-yellow-500 uppercase tracking-widest mb-1">
          All Products
        </p>
        <div className="flex justify-between items-end">
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-100">
            All Products
          </h1>
          <div className="text-xs text-zinc-400 border border-zinc-800 rounded-full p-1 px-3">
            {data?.total ?? 0} products
          </div>
        </div>
      </header>
      {loading ? (
        <ProductListingGridSkeleton />
      ) : error ? (
        <div>Error : {error}</div>
      ) : data && data.total ? (
        <div>
          <VirtualGrid
            items={data.products}
            renderItem={(product) => (
              <ProductCard
                key={product.id}
                product={product}
                source="ALL_PRODUCTS"
              />
            )}
          />
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
