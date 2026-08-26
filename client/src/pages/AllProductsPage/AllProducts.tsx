import { useSearchParams } from "react-router";

import { getAllProductsURL, ROUTES } from "../../shared/constants";
import useFetch from "../../shared/hooks/useFetch";
import type { ProductResponse } from "../../shared/types/api.types";
import ProductListingGridSkeleton from "../ProductListingPage/components/ProductGrid/ProductGridSkeleton";
import BackButton from "../../shared/components/ui/BackButton";
import Pagination from "../../shared/components/ui/Pagination";
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
        <div role="alert" className="text-red-400 text-sm">
          Error : {error}
        </div>
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
          <Pagination
            totalPages={data.totalPages ?? 0}
            currentPage={Number(searchParams.get("page") ?? 1)}
            setSearchParams={setSearchParams}
          />
        </div>
      ) : (
        <div className="mt-32 mx-auto">
          <div className="flex flex-col items-center">
            <span className="text-xl md:text-2xl lg:text-3xl font-bold text-zinc-100 text-center">
              No products found
            </span>
            <span className="text-zinc-400 text-sm lg:text-base text-center">
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
