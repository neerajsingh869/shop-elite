import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "../../store";

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectIsCartOpen = (state: RootState) => state.cart.isOpen;

// use createSelector for memoization benefits
export const selectCartCount = createSelector(
  selectCartItems, // output becomes input for below function
  (items) => items.reduce((count, item) => count + item.quantity, 0),
);
export const selectCartTotal = createSelector(selectCartItems, (items) =>
  items.reduce((total, item) => total + item.price * item.quantity, 0),
);
