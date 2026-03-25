import BackButton from "../../shared/components/ui/BackButton";
import { ROUTES } from "../../shared/constants";

interface CategoryNotFoundProps {
  categoryName: string;
}

function CategoryNotFound({ categoryName }: CategoryNotFoundProps) {
  return (
    <div className="flex flex-col justify-center items-center min-h-[70vh] gap-4">
      <div className="flex flex-col items-center">
        <span className="text-xl md:text-2xl lg:text-3xl font-bold text-zinc-100">
          No products found
        </span>
        <span className="text-zinc-500 text-sm lg:text-base text-center">
          {`No products found in "${categoryName}" category`}
        </span>
      </div>
      <BackButton to={ROUTES.home} label="Browse all categories" />
    </div>
  );
}

export default CategoryNotFound;
