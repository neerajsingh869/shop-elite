import type { RootState } from "../../store";

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectIsCartOpen = (state: RootState) => state.cart.isOpen;
export const selectCartCount = (state: RootState) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);
export const selectCartTotal = (state: RootState) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
