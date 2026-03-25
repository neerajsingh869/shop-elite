import { useParams } from "react-router";

import useFetch from "../../shared/hooks/useFetch";
import useScrollToTop from "../../shared/hooks/useScrollToTop";
import type { ProductResponse } from "../../shared/types/api.types";
import { GET_PRODUCTS_BY_CATEGORY_URL, ROUTES } from "../../shared/constants";
import ProductGrid from "./components/ProductGrid/ProductGrid";
import BackButton from "../../shared/components/ui/BackButton";
import getCategoryName from "../../shared/utils/getCategoryName";
import CategoryNotFound from "./CategoryNotFound";
import ProductListingSkeleton from "./ProductListingSkeleton";
import ProductListingError from "./ProductListingError";

function ProductListingPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { data, error, loading } = useFetch<ProductResponse>(
    GET_PRODUCTS_BY_CATEGORY_URL(categorySlug!),
  );
  const { topRef } = useScrollToTop(loading);

  const categoryName = getCategoryName(categorySlug);

  return (
    <>
      {loading ? (
        <ProductListingSkeleton />
      ) : error ? (
        <ProductListingError errorMessage={error} />
      ) : (
        data &&
        (data.products.length > 0 ? (
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
                <div className="text-xs text-zinc-400 border border-zinc-800 rounded-full p-1 px-3">
                  {data?.total ?? 0} products
                </div>
              </div>
            </header>
            <ProductGrid
              products={data.products}
              categorySlug={categorySlug!}
            />
          </>
        ) : (
          <CategoryNotFound categoryName={categoryName} />
        ))
      )}
    </>
  );
}

export default ProductListingPage;
