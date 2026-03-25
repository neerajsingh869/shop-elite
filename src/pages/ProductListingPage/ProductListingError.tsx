import BackButton from "../../shared/components/ui/BackButton";
import { ROUTES } from "../../shared/constants";

interface ProductListingErrorProps {
  errorMessage: string;
}

function ProductListingError({ errorMessage }: ProductListingErrorProps) {
  return (
    <div className="flex flex-col justify-center items-center min-h-[70vh] gap-4">
      <div className="flex flex-col items-center">
        <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-100">
          Something went wrong
        </span>
        <span className="text-zinc-500 text-base lg:text-lg text-center">
          {errorMessage}
        </span>
      </div>
      <BackButton to={ROUTES.home} label="Browse all categories" />
    </div>
  );
}

export default ProductListingError;
