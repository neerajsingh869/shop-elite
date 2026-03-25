import BackButtonSkeleton from "../../shared/components/ui/BackButtonSkeleton";
import ProductListingGridSkeleton from "./components/ProductGrid/ProductGridSkeleton";

function ProductListingPageSkeleton() {
  return (
    <>
      <BackButtonSkeleton />
      <header className="mb-6">
        <p className="mb-1 animate-pulse bg-neutral-900 h-6 w-28 rounded-lg"></p>
        <div className="flex justify-between items-end">
          <h1 className="bg-neutral-900 h-10 w-44 rounded-lg animate-pulse"></h1>
          <div className="border border-zinc-800 bg-zinc-800 h-4 w-16 rounded-full animate-pulse"></div>
        </div>
      </header>
      <ProductListingGridSkeleton />
    </>
  );
}

export default ProductListingPageSkeleton;
