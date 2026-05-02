import type { ProductFilters } from "../../features/products/product.types";
import createProductSlug from "../utils/createProductSlug";

export const BASE_URL = import.meta.env.VITE_API_URL;

export const GET_CATEGORIES_URL = `${BASE_URL}/api/products/categories`;
// api to get paginated response of products for the specified category
export const GET_PRODUCTS_BY_CATEGORY_URL = (
  categorySlug: string,
  page: number,
) => `${BASE_URL}/api/products/search?category=${categorySlug}&page=${page}`;
export const GET_PRODUCT_URL = (productId: number) =>
  `${BASE_URL}/api/products/${productId}`;

export const buildSearchURL = (filters: ProductFilters, page?: number) => {
  const params = new URLSearchParams();

  if (filters.keyword) params.set("keyword", filters.keyword);
  if (filters.category) params.set("category", filters.category);
  if (filters.brand) params.set("brand", filters.brand);
  if (filters.minPrice) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice) params.set("maxPrice", String(filters.maxPrice));
  if (filters.minDiscount)
    params.set("minDiscount", String(filters.minDiscount));
  if (filters.minRating) params.set("minRating", String(filters.minRating));
  if (filters.availabilityStatus)
    params.set("availabilityStatus", filters.availabilityStatus);
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (page) params.set("page", String(page));

  return `${BASE_URL}/api/products/search?${params.toString()}`;
};

export const buildCategoryMetadataURL = (category: string) =>
  `${BASE_URL}/api/products/category-metadata?category=${category}`;

export const ROUTES = {
  home: "/",
  category: (categorySlug: string) => `/${categorySlug}`,
  product: (categorySlug: string, productId: number, title: string) =>
    `/${categorySlug}/${productId}/${createProductSlug(title)}`,
} as const;
