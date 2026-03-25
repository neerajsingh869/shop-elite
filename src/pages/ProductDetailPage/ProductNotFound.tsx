import { useParams } from "react-router";
import BackButton from "../../shared/components/ui/BackButton";
import { ROUTES } from "../../shared/constants";

function ProductNotFound() {
  const { categorySlug } = useParams();

  return (
    <div className="flex flex-col justify-center items-center min-h-[70vh] gap-4">
      <div className="flex flex-col items-center">
        <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-100">
          Product not found
        </span>
        <span className="text-zinc-500 text-base lg:text-lg text-center">
          This product does not exist or has been removed.
        </span>
      </div>
      <BackButton to={ROUTES.category(categorySlug!)} label="Go back" />
    </div>
  );
}

export default ProductNotFound;
