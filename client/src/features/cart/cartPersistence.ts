import type { CartItem } from "./cart.types";

// utility function to save cart items in localstorage
export const saveCart = (items: CartItem[]) =>
  localStorage.setItem("cart_items", JSON.stringify(items));

// utility function to load cart from localstorage on app load
export const loadCart = (): CartItem[] => {
  try {
    const cartItems = localStorage.getItem("cart_items");
    if (!cartItems) return [];

    return JSON.parse(cartItems);
  } catch {
    return [];
  }
};
