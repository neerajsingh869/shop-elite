import { selectCartTotal } from "../cartSelectors";
import { useAppSelector } from "../../../store/hook";

interface CartSummaryProps {
  onCheckout: () => void;
}

function CartSummary({ onCheckout }: CartSummaryProps) {
  const cartTotal = useAppSelector(selectCartTotal);

  return (
    <div className="border-t border-zinc-800 p-5 bg-zinc-900">
      {/* Subtotal & Other costs */}
      <div className="flex flex-col gap-0.5">
        <div className="flex justify-between">
          <p className="text-zinc-500 text-sm">Subtotal</p>
          <p className="text-zinc-100 text-sm">
            ${cartTotal.toLocaleString("en-US")}
          </p>
        </div>
        <div className="flex justify-between">
          <p className="text-zinc-500 text-sm">Delivery</p>
          <p className="text-emerald-400 text-xs">Free</p>
        </div>
      </div>
      {/* Bottom border */}
      <div className="border-t border-zinc-800 my-3"></div>
      {/* Total amount */}
      <div className="flex justify-between">
        <p className="text-zinc-100 font-semibold">Total</p>
        <p className="text-yellow-500 font-bold text-lg">
          ${cartTotal.toLocaleString("en-US")}
        </p>
      </div>
      {/* Make payment button */}
      <button
        onClick={onCheckout}
        className="bg-yellow-500 text-zinc-950 font-bold rounded-xl py-3 w-full my-3 cursor-pointer"
      >
        Make Payment
      </button>
    </div>
  );
}

export default CartSummary;
