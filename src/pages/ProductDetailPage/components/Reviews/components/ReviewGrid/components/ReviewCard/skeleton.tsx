function ReviewCardSkeleton() {
  return (
    <div>
      <div className="flex gap-3">
        <div className="rounded-full bg-neutral-900 border border-zinc-800 h-10 w-10"></div>
        <div className="flex flex-col gap-2">
          <span className="animate-pulse h-4 w-36 bg-neutral-900"></span>
          <div className="animate-pulse h-2 w-16 bg-neutral-900"></div>
        </div>
      </div>
      <p className="mt-2 mb-6 animate-pulse w-full h-4 bg-neutral-900"></p>
    </div>
  );
}

export default ReviewCardSkeleton;
