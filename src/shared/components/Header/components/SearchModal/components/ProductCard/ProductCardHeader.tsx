import { Link } from "react-router";
import type { Product } from "../../../../../../types/api.types";
import { ROUTES } from "../../../../../../constants";

interface ProductCardProps {
  product: Product;
  setShowSearchModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function ProductCard({ product, setShowSearchModal }: ProductCardProps) {
  return (
    <Link
      to={ROUTES.product(product.category, product.id, product.title)}
      onClick={() => setShowSearchModal(false)}
    >
      <article className="group flex h-24 border border-zinc-800 bg-zinc-950 rounded-xl transition duration-300 hover:border-yellow-700/50 min-w-54">
        <div className="aspect-square bg-neutral-900 rounded-l-xl">
          <img
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-115 p-3"
            src={product.thumbnail}
            alt={product.title}
          />
        </div>
        <div className="py-2 px-3 flex flex-col gap-2 justify-center grow">
          <p className="text-sm line-clamp-2">{product.title}</p>
          <span className="text-xs text-zinc-500">{product.price}</span>
        </div>
      </article>
    </Link>
  );
}

export default ProductCard;
