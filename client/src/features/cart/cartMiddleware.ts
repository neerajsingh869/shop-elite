import { createListenerMiddleware } from "@reduxjs/toolkit";

import { saveCart } from "./cartPersistence";
import type { CartState } from "./cart.types";

// to avoid circular dependency problem in case RootState was used
// -> RootState would be imported from store module
// -> store module import middleware from this module
// this forms circular dependency
type CartSliceState = { cart: CartState };

// needed to store cart items in localstorage
export const listenerMiddleware = createListenerMiddleware<CartSliceState>();

listenerMiddleware.startListening({
  predicate: (_, currentState, previousState) =>
    currentState.cart.items !== previousState.cart.items,
  effect: (_, listenerApi) => {
    saveCart(listenerApi.getState().cart.items);
  },
});
