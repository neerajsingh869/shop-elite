import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { ShoppingCart, Slash, X } from "lucide-react";

import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import { closeCart } from "../cartSlice";
import CheckoutModal from "./CheckoutModal";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { selectCartItems, selectIsCartOpen } from "../cartSelectors";

function CartDrawer() {
  const cartItems = useAppSelector(selectCartItems);
  const isCartOpen = useAppSelector(selectIsCartOpen);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  if (!isCartOpen && !isCheckoutOpen) return null;

  return createPortal(
    <>
      {/* Checkout modal once "Purchase Now" button is clicked */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
      />
      {/* Cart backdrop */}
      {isCartOpen && (
        <div
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              dispatch(closeCart());
            }
          }}
          className="fixed z-50 inset-0 bg-black/60 mx-2"
        >
          {/* Cart Drawer */}
          <div className="bg-zinc-900 flex flex-col w-[380px] absolute right-0 top-0 h-full">
            {/* Header */}
            <header className="p-5 flex justify-between border-b border-b-zinc-800">
              <div className="flex gap-2 items-center">
                <ShoppingCart className="text-yellow-500" />
                <span className="text-zinc-100">Your Cart</span>{" "}
                <span className="bg-yellow-500 text-zinc-950 font-bold rounded-full p-0.5 text-xs">
                  {/* Count of distinct cart items */}
                  {cartItems.length}
                </span>
              </div>
              <X
                onClick={() => {
                  dispatch(closeCart());
                }}
                className="text-zinc-500 w-6 h-6 cursor-pointer"
              />
            </header>
            {cartItems.length > 0 ? (
              <>
                {/* Cart Items */}
                <div className="p-4 flex flex-col gap-3 flex-1 overflow-y-scroll">
                  {cartItems.map((item) => (
                    <CartItem item={item} />
                  ))}
                </div>
                {/* Cart Summary */}
                <div>
                  <CartSummary
                    onCheckout={() => {
                      dispatch(closeCart());
                      setIsCheckoutOpen(true);
                    }}
                  />
                </div>
              </>
            ) : (
              // empty cart
              <div className="flex flex-col justify-center items-center w-full h-full text-center gap-3">
                <div className="flex flex-col gap-1 items-center">
                  <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center relative">
                    <ShoppingCart className="w-8 h-8 text-zinc-500" />
                    <Slash className="rotate-90 text-zinc-500 w-9 h-9 absolute" />
                  </div>
                  <p className="text-zinc-100 mt-3">Your cart is empty</p>
                  <p className="text-zinc-500 text-sm">
                    Add items from the product pages to get started
                  </p>
                </div>
                <button
                  onClick={() => {
                    navigate("/");
                    dispatch(closeCart());
                  }}
                  className="bg-yellow-500 text-zinc-950 font-bold rounded-xl py-3 my-3 cursor-pointer w-1/2"
                >
                  Start Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>,
    document.body,
  );
}

export default CartDrawer;
