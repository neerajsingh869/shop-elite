import { Link } from "react-router";

import type { Product } from "../../../../shared/types/api.types";
import { ROUTES } from "../../../../shared/constants";
import ProductCard from "./components/ProductCard";

interface ProductGridProps {
  products: Product[];
  categorySlug: string;
}

function ProductGrid({ products, categorySlug }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {products.map((product) => (
        <Link
          key={product.id}
          to={ROUTES.product(categorySlug!, product.id, product.title)}
        >
          <ProductCard product={product} />
        </Link>
      ))}
    </div>
  );
}

export default ProductGrid;
