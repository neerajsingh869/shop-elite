import type { Product } from "../../../../shared/types/api.types";
import ProductCard from "./components/ProductCard/ProductCard";

interface ProductGridProps {
  products: Product[];
  categorySlug: string;
}

function ProductGrid({ products, categorySlug }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 flex-1 min-w-0">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          categorySlug={categorySlug}
        />
      ))}
    </div>
  );
}

export default ProductGrid;
