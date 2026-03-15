function CategoryCardSkeleton() {
  return (
    <div className="bg-zinc-950 border-zinc-800 border rounded-xl p-5 flex flex-col items-center justify-center gap-3">
      <div className="h-10 w-10 bg-zinc-800 rounded animate-pulse"></div>
      <p className="h-3 w-20 bg-zinc-800 rounded animate-pulse"></p>
    </div>
  );
}

function CategoryGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {Array.from({ length: 24 }).map((_, index) => (
        <CategoryCardSkeleton key={index} />
      ))}
    </div>
  );
}

export default CategoryGridSkeleton;
