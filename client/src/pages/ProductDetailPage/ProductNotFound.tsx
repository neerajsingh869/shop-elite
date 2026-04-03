import BackButton from "../../shared/components/ui/BackButton";
import { ROUTES } from "../../shared/constants";

interface ProductNotFoundProps {
  categorySlug: string;
}

function ProductNotFound({ categorySlug }: ProductNotFoundProps) {
  return (
    <div className="flex flex-col justify-center items-center min-h-[70vh] gap-4">
      <div className="flex flex-col items-center">
        <span className="text-xl md:text-2xl lg:text-3xl font-bold text-zinc-100">
          Product not found
        </span>
        <span className="text-zinc-500 text-sm lg:text-base text-center">
          This product does not exist or has been removed.
        </span>
      </div>
      <BackButton to={ROUTES.category(categorySlug!)} label="Go back" />
    </div>
  );
}

export default ProductNotFound;
