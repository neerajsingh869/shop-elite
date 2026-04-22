export interface ProductAPIResponse {
  id: number;
  title: string;
  description: string;
  category: string;
  price: string; // Decimal converted into string by prisma
  discountPercentage: string; // Decimal converted into string by prisma
  rating: number;
  stock: number;
  tags: string[];
  brand?: string;
  sku: string;
  weight: number;
  dimensions: { width: number; height: number; depth: number };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: ProductReview[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
  thumbnail: string;
  images: string[];
}

interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductFiltersAPIResponse {
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
