import { useState } from "react";
import { createPortal } from "react-dom";
import { Lock, Mail, Phone, X, Loader2 } from "lucide-react";

import type { CartItem } from "../cart.types";
import { useAppSelector } from "../../../store/hook";
import { useAppDispatch } from "../../../store/hook";
import { selectIsAuthenticated, selectUser } from "../../auth/authSelectors";
import { api } from "../../../shared/lib/axios";
import { clearCart } from "../cartSlice";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
}

function CheckoutModal({ isOpen, onClose, items }: CheckoutModalProps) {
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  if (!isOpen) return null;

  const handlePayment = async () => {
    // validate email
    if (!email) {
      setEmailError("Email is required");
      return;
    }
    if (!phone) {
      setPhoneError("Phone number is required");
      return;
    }
    setPhoneError("");
    setEmailError("");
    setIsLoading(true);

    try {
      // Step 1 — create order on backend
      const { data } = await api.post("/api/orders/create-razorpay-order", {
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
        email,
        phone: phone || undefined,
        totalAmount: total,
      });

      // Step 2 — open Razorpay modal
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        prefill: { email, contact: phone },
        handler: async (response: any) => {
          try {
            // Step 3 — verify payment on backend
            const verify = await api.post("/api/orders/verify-payment", {
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (verify.data.success) {
              dispatch(clearCart());
              onClose();
              alert("Payment successful! Order confirmed.");
            }
          } catch (error) {
            console.error("Verification failed:", error);
            alert("Payment verification failed. Contact support.");
          }
        },
        modal: {
          ondismiss: () => {
            // user closed Razorpay modal without paying
            setIsLoading(false);
          },
        },
        theme: { color: "#eab308" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
      setIsLoading(false);
    }
  };

  return createPortal(
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4"
    >
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-yellow-500 flex items-center justify-center text-zinc-950 font-bold text-sm shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-zinc-100 font-semibold text-sm">
                  {user.name}
                </p>
                <p className="text-zinc-500 text-xs">Logged in</p>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-zinc-100 font-semibold text-base">
                Complete Your Order
              </p>
              <p className="text-zinc-500 text-xs mt-0.5">
                Enter your details to proceed
              </p>
            </div>
          )}
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Email */}
          <div>
            <label className="text-zinc-500 text-xs block mb-2">
              Email address
            </label>
            <div
              className={`bg-zinc-950 border rounded-lg px-4 py-3 flex items-center gap-3 ${emailError ? "border-red-500" : "border-zinc-800"}`}
            >
              <Mail size={16} className="text-zinc-500 shrink-0" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (e.target.value) setEmailError("");
                }}
                placeholder="you@example.com"
                readOnly={isAuthenticated}
                className="bg-transparent text-zinc-100 text-sm flex-1 outline-none placeholder:text-zinc-600"
              />
              {isAuthenticated && (
                <span className="bg-zinc-800 text-emerald-400 text-xs font-semibold px-2 py-0.5 rounded-full shrink-0">
                  pre-filled
                </span>
              )}
            </div>
            {emailError && (
              <p className="text-red-400 text-xs mt-1">{emailError}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="text-zinc-500 text-xs block mb-2">
              Phone number
            </label>
            <div
              className={`bg-zinc-950 border rounded-lg px-4 py-3 flex items-center gap-3 ${phoneError ? "border-red-500" : "border-zinc-800"}`}
            >
              <Phone size={16} className="text-zinc-500 shrink-0" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="bg-transparent text-zinc-100 text-sm flex-1 outline-none placeholder:text-zinc-600"
              />
            </div>
            {phoneError && (
              <p className="text-red-400 text-xs mt-1">{phoneError}</p>
            )}
          </div>

          {/* Order summary */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-4">
            <div className="flex justify-between mb-2">
              <span className="text-zinc-500 text-sm">
                {items.length} item{items.length > 1 ? "s" : ""}
              </span>
              <span className="text-zinc-100 text-sm">
                ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-zinc-500 text-sm">Delivery</span>
              <span className="text-emerald-400 text-sm">Free</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-zinc-800">
              <span className="text-zinc-100 font-semibold text-sm">Total</span>
              <span className="text-yellow-500 font-bold text-lg">
                ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Pay Now button */}
          <button
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full bg-yellow-500 text-zinc-950 font-bold rounded-xl py-4 flex items-center justify-center gap-2 cursor-pointer hover:bg-yellow-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Lock size={16} />
                Pay Now — $
                {total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </>
            )}
          </button>

          {/* Security note */}
          <p className="text-zinc-600 text-xs text-center">
            Secured by Razorpay · 256-bit SSL encryption
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default CheckoutModal;
