import { useState } from "react";
import { Heart, Minus, Plus } from "lucide-react";

import { useAppDispatch } from "../../../../store/hook";
import StarSelf from "../../../../shared/components/ui/Star";
import { addItem, openCart } from "../../../../features/cart/cartSlice";
import type { ProductDetail } from "../../../../shared/types/api.types";
import ProductMetadata from "./components/ProductMetadata/ProductMetadata";
import CheckoutModal from "../../../../features/cart/components/CheckoutModal";

interface AboutProductProps {
  data: ProductDetail;
}

function AboutProduct({ data }: AboutProductProps) {
  const [quantity, setQuantity] = useState(1);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const dispatch = useAppDispatch();

  return (
    <>
      {/* Checkout modal once "Purchase Now" button is clicked */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={[
          {
            productId: data.id,
            title: data.title,
            thumbnail: data.thumbnail,
            price: Number(data.price),
            quantity,
            ...(data.brand && { brand: data.brand }),
          },
        ]}
      />
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
              return <StarSelf key={num} size={3} filled={true} />;
            }
            return <StarSelf key={num} size={3} filled={false} />;
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
          ${Number(data.price).toFixed(2)}
        </span>
        <span className="text-zinc-500 line-through">
          $
          {(
            Number(data.price) /
            (1 - Math.round(Number(data.discountPercentage)) / 100)
          ).toFixed(2)}
        </span>
        <span className="text-emerald-400 bg-emerald-900/20 border border-emerald-800/40 rounded text-xs font-semibold uppercase px-2 py-0.5">
          -{Math.round(Number(data.discountPercentage))}% off
        </span>
      </div>
      <ProductMetadata data={data} />
      {/* Quantity */}
      <div className="flex gap-3 items-center">
        <span className="text-zinc-500">Qty</span>
        <div className="flex gap-3 items-center border border-zinc-800 rounded-md">
          <button
            onClick={() => setQuantity((quantity) => Math.max(1, quantity - 1))}
            className="bg-zinc-800 text-zinc-100 w-8 h-8 p-1.25 rounded-md text-sm cursor-pointer border-none"
          >
            <Minus size={20} />
          </button>

          <span className="text-zinc-100 text-sm font-medium text-center">
            {quantity}
          </span>
          <button
            onClick={() =>
              setQuantity((quantity) => Math.min(data.stock, quantity + 1))
            }
            className="bg-zinc-800 text-zinc-100 w-8 h-8 p-1.25 rounded-md text-sm cursor-pointer border-none"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
      {/* Action buttons */}
      <div className="flex gap-2 self-stretch">
        <button
          onClick={() => {
            dispatch(
              addItem({
                productId: data.id,
                title: data.title,
                thumbnail: data.thumbnail,
                price: Number(data.price),
                quantity,
                ...(data.brand && { brand: data.brand }),
              }),
            );

            dispatch(openCart());
          }}
          className="bg-yellow-500 text-black font-semibold text-sm py-4 px-6 rounded-xl grow transition duration-300 hover:-translate-y-0.5 hover:bg-yellow-400 cursor-pointer"
        >
          Add to Cart
        </button>
        <button
          onClick={() => setIsCheckoutOpen(true)}
          className="border-2 border-yellow-500 text-yellow-500 font-semibold text-sm py-4 px-6 rounded-xl grow transition duration-300 hover:-translate-y-0.5 hover:bg-zinc-900 cursor-pointer"
        >
          Purchase Now
        </button>
        <button className="px-4 py-4 border rounded-xl border-zinc-800 hover:border-zinc-600 transition duration-300 hover:-translate-y-0.5">
          <Heart size={20} className="text-zinc-400" />
        </button>
      </div>
    </>
  );
}

export default AboutProduct;
