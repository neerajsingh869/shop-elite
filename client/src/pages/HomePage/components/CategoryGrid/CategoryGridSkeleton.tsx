import CategoryCardSkeleton from "./components/CategoryCard/CategoryCardSkeleton";

function CategoryGridSkeleton() {
  return (
    /*
      A wall of empty pulsing divs is meaningless to a screen reader - it either
      reads nothing or reads 24 blank items. Hide the bones, announce the state
      once instead (WCAG 4.1.3).
    */
    <div role="status" aria-live="polite">
      <span className="sr-only">Loading categories…</span>
      <div
        aria-hidden="true"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
      >
        {Array.from({ length: 24 }).map((_, index) => (
          <CategoryCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export default CategoryGridSkeleton;
