import createProductSlug from "../utils/createProductSlug";

export const BASE_URL = "https://dummyjson.com";
export const GET_CATEGORIES_URL = `${BASE_URL}/products/categories`;
export const GET_PRODUCTS_BY_CATEGORY_URL = (categorySlug: string) =>
  `${BASE_URL}/products/category/${categorySlug}`;
export const GET_PRODUCT_URL = (productId: number) =>
  `${BASE_URL}/products/${productId}`;

export const getSearchUrlForProducts = (
  searchText: string,
  limit = 0,
  skip = 0,
) => `${BASE_URL}/products/search?q=${searchText}&limit=${limit}&skip=${skip}`;

export const ROUTES = {
  home: "/",
  category: (categorySlug: string) => `/${categorySlug}`,
  product: (categorySlug: string, productId: number, title: string) =>
    `/${categorySlug}/${productId}/${createProductSlug(title)}`,
} as const;
