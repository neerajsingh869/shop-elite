import ProductMetadataSkeleton from "./components/ProductMetadata/skeleton";

function AboutProductSkeleton() {
  return (
    <>
      {/* Product title & brand */}
      <div>
        <h1 className="animate-pulse bg-neutral-900 h-10 w-64 rounded-lg"></h1>
        <p className="mt-1 animate-pulse bg-neutral-900 h-3 w-32 rounded-lg"></p>
      </div>
      {/* Product reviews */}
      <div className="w-full animate-pulse h-12 bg-neutral-900 rounded-lg"></div>
      {/* Product price info */}
      <div className="animate-pulse h-12 bg-neutral-900 w-2/3 rounded-lg"></div>
      <ProductMetadataSkeleton />
      {/* Action buttons */}
      <div className="flex gap-2 self-stretch animate-pulse">
        <button className="h-12 bg-yellow-500 rounded-xl grow"></button>
        <button className="h-12 w-12 border rounded-xl border-zinc-800"></button>
      </div>
    </>
  );
}

export default AboutProductSkeleton;
