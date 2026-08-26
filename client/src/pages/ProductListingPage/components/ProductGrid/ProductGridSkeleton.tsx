import ProductCardSkeleton from "./components/ProductCard/ProductCardSkeleton";

function ProductListingGridSkeleton() {
  return (
    <div role="status" aria-live="polite" className="flex-1 min-w-0">
      <span className="sr-only">Loading products…</span>
      <div
        aria-hidden="true"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {Array.from({ length: 12 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export default ProductListingGridSkeleton;
