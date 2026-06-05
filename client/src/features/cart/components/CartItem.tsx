import { Minus, Plus, Trash2 } from "lucide-react";

import type { CartItem } from "../cart.types";
import { useAppDispatch } from "../../../store/hook";
import { decrementQuantity, incrementQuantity, removeItem } from "../cartSlice";

interface CartItemProps {
  item: CartItem;
}

function CartItem({ item }: CartItemProps) {
  const dispatch = useAppDispatch();

  return (
    <div className="flex gap-3 p-3 bg-zinc-950 rounded-xl border border-zinc-800 justify-start">
      {/* Thumbnail */}
      <img
        className="w-20 h-20 rounded-lg object-cover bg-zinc-800 shrink-0"
        src={item.thumbnail}
        alt={item.title}
      />
      {/* Item info */}
      <div className="flex flex-col gap-3 flex-1 overflow-hidden">
        <div>
          <h1 className="text-zinc-100 text-sm font-medium truncate">
            {item.title}
          </h1>
          <p className="text-xs text-zinc-500">
            by <span className="text-zinc-400">{item.brand ?? "Unknown"}</span>
          </p>
        </div>
        <div className="flex justify-between items-center">
          {/* Quantity */}
          <div className="flex gap-2 items-center border border-zinc-800 rounded-md">
            <button
              onClick={() =>
                dispatch(decrementQuantity({ productId: item.productId }))
              }
              className="bg-zinc-800 text-zinc-100 w-6 h-6 p-1.25 rounded-md text-sm cursor-pointer border-none"
            >
              <Minus size={15} />
            </button>

            <span className="text-zinc-100 text-sm font-medium text-center">
              {item.quantity}
            </span>
            <button
              onClick={() =>
                dispatch(incrementQuantity({ productId: item.productId }))
              }
              className="bg-zinc-800 text-zinc-100 w-6 h-6 p-1.25 rounded-md text-sm cursor-pointer border-none"
            >
              <Plus size={15} />
            </button>
          </div>
          {/* Price */}
          <div className="text-yellow-500 font-bold text-sm">
            ${(item.price * item.quantity).toFixed(2)}
          </div>
        </div>
      </div>
      {/* Trash */}
      <Trash2
        onClick={() => dispatch(removeItem({ productId: item.productId }))}
        className="text-zinc-500 hover:text-red-400 w-5 h-5 cursor-pointer transition-colors self-start"
      />
    </div>
  );
}

export default CartItem;
