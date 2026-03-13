export interface ICategory {
  slug: string;
  name: string;
  url: string;
}

export interface IReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface IProduct {
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

export interface IProductDetail extends IProduct {
  description: string;
  images: string[];
  tags: string[];
  sku: string;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: IReview[];
}

export interface IProductResponse {
  products: IProduct[],
  total: number;
  skip: number;
  limit: number;
}