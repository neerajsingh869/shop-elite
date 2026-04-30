import createProductSlug from "../utils/createProductSlug";

export const BASE_URL = import.meta.env.VITE_API_URL;

export const GET_CATEGORIES_URL = `${BASE_URL}/api/products/categories`;
export const GET_PRODUCTS_BY_CATEGORY_URL = (categorySlug: string) =>
  `${BASE_URL}/api/products/search?category=${categorySlug}`;
export const GET_PRODUCT_URL = (productId: number) =>
  `${BASE_URL}/api/products/${productId}`;

export const ROUTES = {
  home: "/",
  category: (categorySlug: string) => `/${categorySlug}`,
  product: (categorySlug: string, productId: number, title: string) =>
    `/${categorySlug}/${productId}/${createProductSlug(title)}`,
} as const;
