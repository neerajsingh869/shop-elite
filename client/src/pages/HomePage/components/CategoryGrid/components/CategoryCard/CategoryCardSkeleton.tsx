function CategoryCardSkeleton() {
  return (
    <div className="bg-zinc-950 border-zinc-800 border rounded-xl p-5 flex flex-col items-center justify-center gap-3">
      <div className="h-10 w-10 bg-zinc-800 rounded animate-pulse"></div>
      <p className="h-3 w-20 bg-zinc-800 rounded animate-pulse"></p>
    </div>
  );
}

export default CategoryCardSkeleton;
