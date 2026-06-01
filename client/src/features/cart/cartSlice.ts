import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { CartItem, CartState } from "./cart.types";

const initialState: CartState = {
  items: [],
  isOpen: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const itemIndex = state.items.findIndex(
        (item) => item.productId === action.payload.productId,
      );

      if (itemIndex === -1) {
        state.items.push(action.payload);
      } else {
        state.items[itemIndex].quantity = action.payload.quantity;
      }
    },
    removeItem: (state, action: PayloadAction<{ productId: number }>) => {
      const itemIndex = state.items.findIndex(
        (item) => item.productId === action.payload.productId,
      );
      if (itemIndex === -1) return;

      state.items.splice(itemIndex, 1);
    },
    incrementQuantity: (
      state,
      action: PayloadAction<{ productId: number }>,
    ) => {
      const itemIndex = state.items.findIndex(
        (item) => item.productId === action.payload.productId,
      );
      if (itemIndex === -1) return;

      state.items[itemIndex].quantity++;
    },
    decrementQuantity: (
      state,
      action: PayloadAction<{ productId: number }>,
    ) => {
      const itemIndex = state.items.findIndex(
        (item) => item.productId === action.payload.productId,
      );
      if (itemIndex === -1) return;

      if (state.items[itemIndex].quantity <= 1) {
        state.items.splice(itemIndex, 1);
        return;
      }

      state.items[itemIndex].quantity--;
    },
    clearCart: (state) => {
      state.items = [];
    },
    openCart: (state) => {
      state.isOpen = true;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
  },
});

// export actions that we can use to trigger state changes
export const {
  addItem,
  removeItem,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  closeCart,
  openCart,
} = cartSlice.actions;

// export reducer so that we can register it in the global state
export const cartReducer = cartSlice.reducer;
