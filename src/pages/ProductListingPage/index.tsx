import { Link, useParams } from "react-router";

import useFetch from "../../shared/hooks/useFetch";
import ProductCard from "./components/ProductCard";
import useScrollToTop from "../../shared/hooks/useScrollToTop";
import ProductListingGridSkeleton from "./components/Skeleton";
import type { ProductResponse } from "../../shared/types/api.types";
import { GET_PRODUCTS_BY_CATEGORY_URL, ROUTES } from "../../shared/constants";

function ProductListingPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { data, error, loading } = useFetch<ProductResponse>(
    GET_PRODUCTS_BY_CATEGORY_URL(categorySlug!),
  );
  const { topRef } = useScrollToTop(loading);

  const categoryName = categorySlug
    ? categorySlug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "Unknown";

  return (
    <>
      <div className="absolute top-0" ref={topRef}></div>
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
      {loading && <ProductListingGridSkeleton />}
      {!loading && error && (
        <div className="text-red-400 text-sm">Error: {error}</div>
      )}
      {!loading && !error && data && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {data.products.map((product) => (
            <Link
              key={product.id}
              to={ROUTES.product(categorySlug!, product.id, product.title)}
            >
              <ProductCard product={product} />
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

export default ProductListingPage;
