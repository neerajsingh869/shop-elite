import { useParams, useSearchParams } from "react-router";

import type {
  CategoryMetadataResponse,
  ProductResponse,
} from "../../shared/types/api.types";

import CategoryNotFound from "./CategoryNotFound";
import useFetch from "../../shared/hooks/useFetch";
import ProductListingError from "./ProductListingError";
import ProductListingSkeleton from "./ProductListingSkeleton";
import useScrollToTop from "../../shared/hooks/useScrollToTop";
import ProductGrid from "./components/ProductGrid/ProductGrid";
import BackButton from "../../shared/components/ui/BackButton";
import getCategoryName from "../../shared/utils/getCategoryName";
import {
  buildCategoryMetadataURL,
  buildSearchURL,
  ROUTES,
} from "../../shared/constants";
import type { ProductFilters } from "../../features/products/product.types";
import ProductFiltersComponent from "./components/ProductFilters/ProductFilters";
import ProductListingGridSkeleton from "./components/ProductGrid/ProductGridSkeleton";

const VALID_SORT_VALUES = [
  "price_asc",
  "price_desc",
  "rating_desc",
  "discount_desc",
] as const;

function getString(val: unknown): string | undefined {
  return typeof val === "string" ? val : undefined;
}

function getNumber(val: unknown): number | undefined {
  const num = Number(val);
  return isNaN(num) ? undefined : num;
}

function getSortBy(val: unknown): ProductFilters["sortBy"] {
  const str = getString(val);
  if (!str) return undefined;

  return VALID_SORT_VALUES.includes(str as never)
    ? (str as ProductFilters["sortBy"])
    : undefined;
}

function ProductListingPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: ProductFilters = {
    keyword: getString(searchParams.get("keyword")),
    category: categorySlug,
    brand:
      searchParams.getAll("brand").length > 0
        ? searchParams.getAll("brand")
        : undefined,
    minPrice: getNumber(searchParams.get("minPrice")),
    maxPrice: getNumber(searchParams.get("maxPrice")),
    minDiscount: getNumber(searchParams.get("minDiscount")),
    minRating: getNumber(searchParams.get("minRating")),
    availabilityStatus: getString(searchParams.get("availabilityStatus")),
    sortBy: getSortBy(searchParams.get("sortBy")),
  };
  const productResponse = useFetch<ProductResponse>(
    buildSearchURL(filters, Number(searchParams.get("page") ?? 1)),
  );
  // Fetch category metadata to build dynamic filter
  const categoryMetadata = useFetch<CategoryMetadataResponse>(
    buildCategoryMetadataURL(categorySlug!),
  );

  const { topRef } = useScrollToTop(productResponse.loading);

  const categoryName = getCategoryName(categorySlug);

  if (categoryMetadata.loading) {
    return <ProductListingSkeleton />;
  }

  if (categoryMetadata.error) {
    return (
      <ProductListingError
        message={categoryMetadata.error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!categoryMetadata || !categoryMetadata.data) {
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
            {productResponse?.data?.total ?? 0} products
          </div>
        </div>
      </header>
      <div className="flex gap-8 lg:gap-16 items-start">
        <ProductFiltersComponent
          brands={categoryMetadata.data?.brands ?? []}
          minPrice={categoryMetadata.data?.minPrice || 0}
          maxPrice={categoryMetadata.data?.maxPrice || 10000}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />
        {productResponse.loading ? (
          <ProductListingGridSkeleton />
        ) : productResponse.data && productResponse.data.total ? (
          <div>
            <ProductGrid
              products={productResponse.data.products}
              categorySlug={categorySlug!}
              source="PRODUCT_LISTING"
            />
            <div className="flex justify-center gap-2 mt-3">
              {productResponse.data.totalPages &&
                productResponse.data.totalPages > 1 &&
                Array.from({ length: productResponse.data.totalPages }).map(
                  (_, index) => (
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
                  ),
                )}
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
      </div>
    </>
  );
}

export default ProductListingPage;
