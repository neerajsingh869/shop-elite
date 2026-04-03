import type { Category } from "../../../../shared/types/api.types";
import CategoryCard from "./components/CategoryCard/CategoryCard";

interface CategoryGridProps {
  data: Category[];
}

function CategoryGrid({ data }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {data.map((category) => (
        <CategoryCard key={category.slug} category={category} />
      ))}
    </div>
  );
}

export default CategoryGrid;
