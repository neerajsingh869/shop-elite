import { prisma } from "../src/lib/prisma.js";

interface DummyJsonReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

interface DummyJsonProduct {
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
  dimensions: { width: number; height: number; depth: number };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: DummyJsonReview[];
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

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function seed() {
  try {
    console.log("Starting seed...");

    const response = await fetch("https://dummyjson.com/products?limit=0");
    if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);

    const { products } = (await response.json()) as {
      products: DummyJsonProduct[];
    };
    console.log(`Fetched ${products.length} products`);

    for (const product of products) {
      await prisma.product.upsert({
        where: { id: product.id },
        update: {},
        create: {
          id: product.id,
          productSlug: createSlug(product.title),
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
          dimensions: product.dimensions,
          warrantyInformation: product.warrantyInformation,
          shippingInformation: product.shippingInformation,
          availabilityStatus: product.availabilityStatus,
          returnPolicy: product.returnPolicy,
          minimumOrderQuantity: product.minimumOrderQuantity,
          meta: product.meta,
          thumbnail: product.thumbnail,
          images: product.images,
          reviews: {
            create: product.reviews.map((r) => ({
              rating: r.rating,
              comment: r.comment,
              date: new Date(r.date),
              reviewerName: r.reviewerName,
              reviewerEmail: r.reviewerEmail,
            })),
          },
        },
      });
    }

    console.log("Seed complete");
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
