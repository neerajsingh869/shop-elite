export interface ProductFilters {
  keyword?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minDiscount?: number;
  minRating?: number;
  availabilityStatus?: string;
  sortBy?: "price_asc" | "price_desc" | "rating_desc" | "discount_desc";
}
