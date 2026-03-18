import type { Product } from "../../../../shared/types/api.types";
import ProductCard from "./components/ProductCard";

interface ProductGridProps {
  products: Product[];
  categorySlug: string;
}

function ProductGrid({ products, categorySlug }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
