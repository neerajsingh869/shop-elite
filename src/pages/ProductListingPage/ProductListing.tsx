import { useParams } from "react-router";

import type { ProductResponse } from "../../shared/types/api.types";

import CategoryNotFound from "./CategoryNotFound";
import useFetch from "../../shared/hooks/useFetch";
import ProductListingError from "./ProductListingError";
import ProductListingSkeleton from "./ProductListingSkeleton";
import useScrollToTop from "../../shared/hooks/useScrollToTop";
import ProductGrid from "./components/ProductGrid/ProductGrid";
import BackButton from "../../shared/components/ui/BackButton";
import getCategoryName from "../../shared/utils/getCategoryName";
import { GET_PRODUCTS_BY_CATEGORY_URL, ROUTES } from "../../shared/constants";

function ProductListingPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { data, error, loading } = useFetch<ProductResponse>(
    GET_PRODUCTS_BY_CATEGORY_URL(categorySlug!),
  );
  const { topRef } = useScrollToTop(loading);

  const categoryName = getCategoryName(categorySlug);

  if (loading) {
    return <ProductListingSkeleton />;
  }

  if (error) {
    return (
      <ProductListingError
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!data || data.products.length <= 0) {
    return <CategoryNotFound categoryName={categoryName} />;
  }

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
          <div className="text-xs text-zinc-400 border border-zinc-800 rounded-full p-1 px-3">
            {data?.total ?? 0} products
          </div>
        </div>
      </header>
      <ProductGrid products={data.products} categorySlug={categorySlug!} />
    </>
  );
}

export default ProductListingPage;
