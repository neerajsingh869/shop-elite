import { prisma } from "../src/lib/prisma";

function createProductSlug(title: string): string {
  const productSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return productSlug;
}

interface DummyJSONProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string;
  sku: string;
  weight: number;
  dimensions: Dimension;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Review[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: Meta;
  thumbnail: string;
  images: string[];
}

interface Dimension {
  width: number;
  height: number;
  depth: number;
}

interface Meta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

async function addProductsToDB() {
  try {
    const response = await fetch(`https://dummyjson.com/products?limit=0`);
    const jsonResponse = await response.json();
    const products = jsonResponse["products"] as DummyJSONProduct[];

    // loop over products and save to db
    for (const product of products) {
      await prisma.product.upsert({
        where: { id: product.id },
        update: {},
        create: {
          id: product.id,
          productSlug: createProductSlug(product.title),
          title: product.title,
          description: product.description,
          category: product.category,
          price: product.price,
          discountPercentage: product.discountPercentage,
          rating: product.rating,
          stock: product.stock,
          tags: product.tags,
          brand: product.brand,
          sku: product.sku,
          weight: product.weight,
          dimensions: {
            width: product.dimensions.width,
            height: product.dimensions.height,
            depth: product.dimensions.depth,
          },
          warrantyInformation: product.warrantyInformation,
          shippingInformation: product.shippingInformation,
          availabilityStatus: product.availabilityStatus,
          reviews: {
            create: product.reviews,
          },
          returnPolicy: product.returnPolicy,
          minimumOrderQuantity: product.minimumOrderQuantity,
          meta: {
            createdAt: product.meta.createdAt,
            updatedAt: product.meta.updatedAt,
            barcode: product.meta.barcode,
            qrcode: product.meta.qrCode,
          },
          thumbnail: product.thumbnail,
          images: product.images,
        },
      });
    }
  } catch (err) {
    console.error("Error: ", err);
  } finally {
    prisma.$disconnect();
  }
}

addProductsToDB();
