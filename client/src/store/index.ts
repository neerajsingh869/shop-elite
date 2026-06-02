import { configureStore } from "@reduxjs/toolkit";

import { authReducer } from "../features/auth/authSlice";
import { cartReducer } from "../features/cart/cartSlice";
import { loadCart } from "../features/cart/cartPersistence";
import { listenerMiddleware } from "../features/cart/cartMiddleware";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware), // listeners should run first, that's why prepend
  devTools: import.meta.env.VITE_NODE_ENV !== "production",
  preloadedState: {
    cart: {
      // loadCart() reads from localstorage at store cration time before any component mounts
      items: loadCart(),
      isOpen: false,
    },
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
