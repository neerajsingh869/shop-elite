import { Heart, Star } from "lucide-react";

import type { ProductDetail } from "../../../../shared/types/api.types";
import ProductMetadata from "./components/ProductMetadata/ProductMetadata";

interface AboutProductProps {
  data: ProductDetail;
}

function AboutProduct({ data }: AboutProductProps) {
  return (
    <>
      {/* Product title & brand */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-zinc-100">
          {data.title}
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          by <span className="text-zinc-400">{data.brand ?? "Unknown"}</span>
        </p>
      </div>
      {/* Product reviews */}
      <div className="py-3 border-y flex gap-3 items-center w-full border-y-zinc-800">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((num) => {
            if (num <= Math.round(data.rating)) {
              return (
                <Star
                  size={12}
                  fill="oklch(85.2% 0.199 91.936)"
                  color="oklch(85.2% 0.199 91.936)"
                  strokeWidth={1.5}
                />
              );
            }
            return (
              <Star
                size={12}
                fill="oklch(0.552 0.016 285.938)"
                color="oklch(0.552 0.016 285.938)"
                strokeWidth={1.5}
              />
            );
          })}
        </div>
        <span className="text-zinc-100 text-sm font-bold">{data.rating}</span>
        <span className="text-sm text-zinc-500">
          {data.reviews.length} reviews
        </span>
      </div>
      {/* Product price info */}
      <div className="flex gap-3 flex-wrap items-end">
        <span className="text-2xl md:text-3xl text-yellow-400 font-bold ">
          ${data.price}
        </span>
        <span className="text-zinc-500 line-through">
          $
          {(
            data.price /
            (1 - Math.round(data.discountPercentage) / 100)
          ).toFixed(2)}
        </span>
        <span className="text-emerald-400 bg-emerald-900/20 border border-emerald-800/40 rounded text-xs font-semibold uppercase px-2 py-0.5">
          -{Math.round(data.discountPercentage)}% off
        </span>
      </div>
      <ProductMetadata data={data} />
      {/* Action buttons */}
      <div className="flex gap-2 self-stretch">
        <button className="bg-yellow-500 text-black font-semibold text-sm py-4 px-6 rounded-xl grow transition duration-300 hover:-translate-y-0.5 hover:bg-yellow-400">
          Add to Cart
        </button>
        <button className="px-4 py-4 border rounded-xl border-zinc-800 hover:border-zinc-600 transition duration-300 hover:-translate-y-0.5">
          <Heart size={20} className="text-zinc-400" />
        </button>
      </div>
    </>
  );
}

export default AboutProduct;
