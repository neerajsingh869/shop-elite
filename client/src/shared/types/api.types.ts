export interface Category {
  slug: string;
  name: string;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  thumbnail: string;
}

export interface ProductDetail extends Product {
  description: string;
  images: string[];
  tags: string[];
  sku: string;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Review[];
}

export interface ProductResponse {
  products: Product[];
  // total: number; TODO
  // skip: number; TODO
  // limit: number; TODO
}
