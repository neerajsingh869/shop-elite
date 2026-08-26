import { Minus, Plus, Trash2 } from "lucide-react";

// aliased because this file also declares a component called CartItem - without
// the alias the default export becomes ambiguous under verbatimModuleSyntax
import type { CartItem as CartItemData } from "../cart.types";
import { useAppDispatch } from "../../../store/hook";
import { decrementQuantity, incrementQuantity, removeItem } from "../cartSlice";

interface CartItemProps {
  item: CartItemData;
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
          <h3 className="text-zinc-100 text-sm font-medium truncate">
            {item.title}
          </h3>
          <p className="text-xs text-zinc-400">
            by <span className="text-zinc-400">{item.brand ?? "Unknown"}</span>
          </p>
        </div>
        <div className="flex justify-between items-center">
          {/*
            Quantity. Every label repeats the product title because the cart
            has several of these - "Increase quantity" on its own tells a
            screen reader user nothing about which row they are on.
          */}
          <div className="flex gap-2 items-center border border-zinc-800 rounded-md">
            <button
              onClick={() =>
                dispatch(decrementQuantity({ productId: item.productId }))
              }
              aria-label={`Decrease quantity of ${item.title}`}
              className="bg-zinc-800 text-zinc-100 w-6 h-6 p-1.25 rounded-md text-sm cursor-pointer border-none"
            >
              <Minus size={15} aria-hidden="true" />
            </button>

            <span className="text-zinc-100 text-sm font-medium text-center">
              {/* reads as "Quantity: 2" instead of a bare number */}
              <span className="sr-only">Quantity:</span>
              {item.quantity}
            </span>
            <button
              onClick={() =>
                dispatch(incrementQuantity({ productId: item.productId }))
              }
              aria-label={`Increase quantity of ${item.title}`}
              className="bg-zinc-800 text-zinc-100 w-6 h-6 p-1.25 rounded-md text-sm cursor-pointer border-none"
            >
              <Plus size={15} aria-hidden="true" />
            </button>
          </div>
          {/* Price */}
          <div className="text-yellow-500 font-bold text-sm">
            ${(item.price * item.quantity).toFixed(2)}
          </div>
        </div>
      </div>
      {/*
        Was a bare <Trash2 onClick> svg - no role, no name, and impossible to
        reach with a keyboard because svg is not in the tab order.
      */}
      <button
        onClick={() => dispatch(removeItem({ productId: item.productId }))}
        aria-label={`Remove ${item.title} from cart`}
        className="self-start rounded-md cursor-pointer"
      >
        <Trash2
          aria-hidden="true"
          className="text-zinc-400 hover:text-red-400 w-5 h-5 transition-colors"
        />
      </button>
    </div>
  );
}

export default CartItem;
