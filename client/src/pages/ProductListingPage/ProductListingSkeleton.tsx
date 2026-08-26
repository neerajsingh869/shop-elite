import BackButtonSkeleton from "../../shared/components/ui/BackButtonSkeleton";
import ProductListingGridSkeleton from "./components/ProductGrid/ProductGridSkeleton";

function ProductListingPageSkeleton() {
  return (
    <>
      <span className="sr-only" role="status">
        Loading category…
      </span>
      <div aria-hidden="true">
      <BackButtonSkeleton />
      <header className="mb-6">
        <p className="mb-1 animate-pulse bg-neutral-900 h-6 w-28 rounded-lg"></p>
        <div className="flex justify-between items-end">
          <div className="bg-neutral-900 h-10 w-44 rounded-lg animate-pulse"></div>
          <div className="border border-zinc-800 bg-zinc-800 h-4 w-16 rounded-full animate-pulse"></div>
        </div>
      </header>
      <div className="flex gap-8 lg:gap-16 items-start justify-between">
        <div className="w-52 shrink-0 sticky flex flex-col gap-4 top-4 animate-pulse bg-neutral-900 min-h-screen"></div>
        <div>
          <ProductListingGridSkeleton />
        </div>
      </div>
      </div>
    </>
  );
}

export default ProductListingPageSkeleton;
