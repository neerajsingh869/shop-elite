import { useParams } from "react-router";

import useFetch from "../../shared/hooks/useFetch";
import useScrollToTop from "../../shared/hooks/useScrollToTop";
import type { ProductResponse } from "../../shared/types/api.types";
import { GET_PRODUCTS_BY_CATEGORY_URL, ROUTES } from "../../shared/constants";
import ProductGrid from "./components/ProductGrid";
import ProductListingGridSkeleton from "./components/ProductGrid/skeleton";
import BackButton from "../../shared/components/ui/BackButton";
import getCategoryName from "../../shared/utils/getCategoryName";

function ProductListingPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { data, error, loading } = useFetch<ProductResponse>(
    GET_PRODUCTS_BY_CATEGORY_URL(categorySlug!),
  );
  const { topRef } = useScrollToTop(loading);

  const categoryName = getCategoryName(categorySlug);

  return (
    <>
      <div className="absolute top-0" ref={topRef}></div>
      <BackButton to={ROUTES.home} label="All Categories" />
      <header className="mb-6">
        <p className="text-xs text-yellow-500 uppercase tracking-widest mb-1">
          {categoryName}
        </p>
        <div className="flex justify-between items-end">
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-100">
            {categoryName}
          </h1>
          {loading ? (
            <div className="border border-zinc-800 bg-zinc-800 h-4 w-16 rounded-full animate-pulse"></div>
          ) : (
            <div className="text-xs text-zinc-400 border border-zinc-800 rounded-full p-1 px-3">
              {data?.total ?? 0} products
            </div>
          )}
        </div>
      </header>
      {loading ? (
        <ProductListingGridSkeleton />
      ) : error ? (
        <div className="text-red-400 text-sm">Error: {error}</div>
      ) : (
        data && (
          <ProductGrid products={data.products} categorySlug={categorySlug!} />
        )
      )}
    </>
  );
}

export default ProductListingPage;
