import { useState } from "react";
import { useNavigate } from "react-router";
import { ShoppingCart, Slash, X } from "lucide-react";

import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import { closeCart } from "../cartSlice";
import CheckoutModal from "./CheckoutModal";
import Modal from "../../../shared/components/ui/Modal";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { selectCartItems, selectIsCartOpen } from "../cartSelectors";

function CartDrawer() {
  const cartItems = useAppSelector(selectCartItems);
  const isCartOpen = useAppSelector(selectIsCartOpen);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <>
      {/*
        Deliberately outside the isCartOpen check - opening checkout closes the
        drawer, and if this lived inside it the payment modal would unmount the
        instant you clicked through to it.
      */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
      />
      <Modal
        isOpen={isCartOpen}
        onClose={() => dispatch(closeCart())}
        labelledBy="cart-drawer-title"
        backdropClassName="fixed z-50 inset-0 bg-black/60 mx-2"
        className="bg-zinc-900 flex flex-col w-[380px] absolute right-0 top-0 h-full"
      >
        {/* Header */}
        <header className="p-5 flex justify-between border-b border-b-zinc-800">
          <div className="flex gap-2 items-center">
            <ShoppingCart aria-hidden="true" className="text-yellow-500" />
            {/*
              This names the whole dialog, so the count goes in here too - it
              is the first thing announced when the drawer opens.
            */}
            <h2 id="cart-drawer-title" className="text-zinc-100">
              Your Cart
              <span className="sr-only">
                , {cartItems.length}{" "}
                {cartItems.length === 1 ? "item" : "items"}
              </span>
            </h2>
            <span
              aria-hidden="true"
              className="bg-yellow-500 text-zinc-950 font-bold rounded-full p-0.5 text-xs"
            >
              {/* Count of distinct cart items */}
              {cartItems.length}
            </span>
          </div>
          {/* was a bare <X onClick> svg - not focusable, no role, no name */}
          <button
            onClick={() => dispatch(closeCart())}
            aria-label="Close cart"
            className="rounded-md cursor-pointer"
          >
            <X aria-hidden="true" className="text-zinc-400 w-6 h-6" />
          </button>
        </header>
        {cartItems.length > 0 ? (
          <>
            {/* Cart Items - a list so the count is announced up front */}
            <ul className="p-4 flex flex-col gap-3 flex-1 overflow-y-auto">
              {cartItems.map((item) => (
                <li key={item.productId}>
                  <CartItem item={item} />
                </li>
              ))}
            </ul>
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
              <div
                aria-hidden="true"
                className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center relative"
              >
                <ShoppingCart className="w-8 h-8 text-zinc-400" />
                <Slash className="rotate-90 text-zinc-400 w-9 h-9 absolute" />
              </div>
              <p className="text-zinc-100 mt-3">Your cart is empty</p>
              <p className="text-zinc-400 text-sm">
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
      </Modal>
    </>
  );
}

export default CartDrawer;
