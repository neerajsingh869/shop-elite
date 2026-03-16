function ProductCardSkeleton() {
  return (
    <article className="bg-zinc-950 border-zinc-800 border rounded-xl h-60">
      <div className="bg-neutral-900 rounded-t-xl w-full h-3/4 animate-pulse aspect-square"></div>
      <div className="p-3 h-1/4 flex flex-col justify-between">
        <p className="mb-2 h-3 animate-pulse bg-neutral-900"></p>
        <div className="flex justify-between items-end gap-16">
          <p className="animate-pulse bg-neutral-900 h-3 grow-2"></p>
          <p className="animate-pulse bg-neutral-900 h-3 grow"></p>
        </div>
      </div>
    </article>
  );
}

function ProductListingGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

export default ProductListingGridSkeleton;
