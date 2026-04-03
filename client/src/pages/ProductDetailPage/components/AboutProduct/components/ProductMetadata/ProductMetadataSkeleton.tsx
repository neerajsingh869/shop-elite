import MoreInfoSkeleton from "../MoreInfo/MoreInfoSkeleton";
import TagSkeleton from "../Tag/TagSkeleton";

function ProductMetadataSkeleton() {
  return (
    <>
      {/* Product description skeleton */}
      <p className="h-4 w-full bg-neutral-900 animate-pulse rounded-lg"></p>
      <p className="h-4 w-full bg-neutral-900 animate-pulse rounded-lg -mt-4"></p>
      {/* More info about product skeleton */}
      <div className="grid grid-cols-2 gap-2 w-full">
        <MoreInfoSkeleton />
        <MoreInfoSkeleton />
        <MoreInfoSkeleton />
        <MoreInfoSkeleton />
      </div>
      {/* Tags skeleton */}
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <TagSkeleton key={index} />
        ))}
      </div>
    </>
  );
}

export default ProductMetadataSkeleton;
