export const BASE_URL = "https://dummyjson.com";
export const GET_CATEGORIES_URL = `${BASE_URL}/products/categories`;

function createProductSlug(title: string): string {
  const productSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return productSlug;
}

export const ROUTES = {
  home: "/",
  category: (categorySlug: string) => `/${categorySlug}`,
  product: (categorySlug: string, productId: number, title: string) =>
    `/${categorySlug}/${productId}/${createProductSlug(title)}`,
} as const;
