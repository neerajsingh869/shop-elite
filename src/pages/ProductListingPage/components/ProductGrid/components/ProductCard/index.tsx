import { Star } from "lucide-react";
import type { Product } from "../../../../../../shared/types/api.types";
import { Link } from "react-router";
import { ROUTES } from "../../../../../../shared/constants";

interface ProductCardProps {
  product: Product;
  categorySlug: string;
}

function ProductCard({ product, categorySlug }: ProductCardProps) {
  return (
    <Link to={ROUTES.product(categorySlug!, product.id, product.title)}>
      <article className="group bg-zinc-950 border-zinc-800 border rounded-xl transition duration-300 hover:border-yellow-700/50 hover:-translate-y-1 overflow-hidden">
        <div className="relative aspect-square bg-neutral-900 rounded-t-xl">
          <img
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 p-3"
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
          />
          {product.discountPercentage > 10 && (
            <span className="absolute top-2 left-2 text-xs font-bold text-black bg-yellow-500 rounded py-0.5 px-2">
              -{Math.round(product.discountPercentage)}%
            </span>
          )}
        </div>
        <div className="p-3">
          <p className="text-xs mb-2 line-clamp-2">{product.title}</p>
          <div className="flex justify-between items-end">
            <span className="text-sm font-bold text-yellow-400">
              ${product.price}
            </span>
            <span className="text-xs text-zinc-500 flex items-center gap-1">
              <Star
                size={10}
                fill="oklch(79.5% 0.184 86.047)"
                color="oklch(79.5% 0.184 86.047)"
              />{" "}
              {product.rating}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default ProductCard;
