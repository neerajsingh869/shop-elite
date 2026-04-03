import { useEffect, useState } from "react";
import { useParams } from "react-router";

import type { Product, ProductResponse } from "../../shared/types/api.types";

import CategoryNotFound from "./CategoryNotFound";
import useFetch from "../../shared/hooks/useFetch";
import ProductListingError from "./ProductListingError";
import ProductListingSkeleton from "./ProductListingSkeleton";
import useScrollToTop from "../../shared/hooks/useScrollToTop";
import ProductGrid from "./components/ProductGrid/ProductGrid";
import BackButton from "../../shared/components/ui/BackButton";
import getCategoryName from "../../shared/utils/getCategoryName";
import { GET_PRODUCTS_BY_CATEGORY_URL, ROUTES } from "../../shared/constants";
import ProductFilters from "./components/ProductFilters/ProductFilters";

interface Range {
  min: number;
  max: number;
}

export interface Filters {
  priceRange: Range;
  minRating: number; // 0 = no filter
  minDiscount: number; // 0 = no filter
  brands: string[]; // [] = all brands shown
  inStockOnly: boolean; // false = no filter
}

function getDefaultFilters(products: Product[]): Filters {
  let minPrice = Infinity;
  let maxPrice = -Infinity;

  for (const product of products) {
    minPrice = Math.min(minPrice, product.price);
    maxPrice = Math.max(maxPrice, product.price);
  }

  return {
    priceRange: { min: minPrice, max: maxPrice },
    minRating: 0,
    minDiscount: 0,
    brands: [],
    inStockOnly: false,
  };
}

function applyFilters(filters: Filters, products: Product[]): Product[] {
  const filteredProducts: Product[] = [];

  for (const product of products) {
    if (
      product.price < filters.priceRange.min ||
      product.price > filters.priceRange.max
    ) {
      continue;
    }
    if (filters.minRating > 0 && product.rating < filters.minRating) continue;
    if (
      filters.minDiscount > 0 &&
      product.discountPercentage < filters.minDiscount
    )
      continue;
    if (
      filters.brands.length > 0 &&
      !filters.brands.includes(product.brand ?? "")
    )
      continue;

    if (filters.inStockOnly && product.stock <= 0) continue;

    filteredProducts.push(product);
  }

  return filteredProducts;
}

function ProductListingPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { data, error, loading } = useFetch<ProductResponse>(
    GET_PRODUCTS_BY_CATEGORY_URL(categorySlug!),
  );
  const [filters, setFilters] = useState<Filters | null>(
    data?.products ? getDefaultFilters(data.products) : null,
  );

  useEffect(() => {
    if (data?.products) {
      setFilters(getDefaultFilters(data.products));
    }
  }, [data]);

  const filteredProducts =
    filters && data?.products
      ? applyFilters(filters, data.products)
      : (data?.products ?? []);

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

  if (!filters) {
    return <ProductListingSkeleton />;
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
            {filteredProducts.length ?? 0} products
          </div>
        </div>
      </header>
      <div className="flex gap-8 lg:gap-16 items-start">
        <ProductFilters
          brands={[
            ...new Set(
              data.products
                .map((product) => product.brand)
                .filter((brand) => Boolean(brand)),
            ),
          ]}
          minPrice={data.products.reduce(
            (acc, curr) => Math.min(acc, curr.price),
            Infinity,
          )}
          maxPrice={data.products.reduce(
            (acc, curr) => Math.max(acc, curr.price),
            -Infinity,
          )}
          filters={filters}
          setFilters={setFilters}
        />
        <ProductGrid products={filteredProducts} categorySlug={categorySlug!} />
      </div>
    </>
  );
}

export default ProductListingPage;
