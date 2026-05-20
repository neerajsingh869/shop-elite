import {
  ProductOrderByWithRelationInput,
  ProductWhereInput,
} from "../../generated/prisma/models.js";

import { prisma } from "../../lib/prisma.js";
import { ProductFilters } from "./product.types.js";

// Cache metadata in memory — categories/brands rarely change
// This prevents a DB hit on every single LLM search request
let metadataCache: {
  categories: string[];
  brands: string[];
  availabilityStatuses: string[];
} | null = null;

function buildOrderBy(
  sortBy: ProductFilters["sortBy"],
): ProductOrderByWithRelationInput {
  switch (sortBy) {
    case "price_asc":
      return { price: "asc" };
    case "price_desc":
      return { price: "desc" };
    case "rating_desc":
      return { rating: "desc" };
    case "discount_desc":
      return { discountPercentage: "desc" };
    default:
      return { id: "asc" }; // deterministic default
  }
}

function formatCategoryName(slug: string) {
  return slug
    .split("-")
    .map((word) => word[0].toUpperCase() + word.substring(1))
    .join(" ");
}

export async function searchProducts(
  filters: ProductFilters,
  offsetPagination?: { page: number; limit: number },
  cursorPagination?: { cursor: number | undefined; limit: number },
) {
  const where: ProductWhereInput = {
    ...(filters.keyword && {
      title: { contains: filters.keyword, mode: "insensitive" },
    }),
    ...(filters.category && {
      category: { equals: filters.category, mode: "insensitive" },
    }),
    ...(filters.brand && {
      brand: Array.isArray(filters.brand)
        ? { in: filters.brand }
        : { equals: filters.brand, mode: "insensitive" },
    }),
    ...(filters.availabilityStatus && {
      availabilityStatus: filters.availabilityStatus,
    }),
    ...((filters.minPrice !== undefined || filters.maxPrice !== undefined) && {
      price: {
        ...(filters.minPrice !== undefined && { gte: filters.minPrice }),
        ...(filters.maxPrice !== undefined && { lte: filters.maxPrice }),
      },
    }),
    ...(filters.minRating !== undefined && {
      rating: { gte: filters.minRating },
    }),
    ...(filters.minDiscount !== undefined && {
      discountPercentage: { gte: filters.minDiscount },
    }),
  };

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: buildOrderBy(filters.sortBy),
      ...(offsetPagination && {
        skip: (offsetPagination.page - 1) * offsetPagination.limit,
        take: offsetPagination.limit,
      }),
      ...(cursorPagination && {
        take: cursorPagination.limit,
        ...(cursorPagination.cursor && {
          skip: 1,
          cursor: {
            id: cursorPagination.cursor,
          },
        }),
      }),
    }),
  ]);

  if (cursorPagination) {
    const hasMore = products.length === cursorPagination.limit;
    const latestCursor =
      products.length > 0 ? products[products.length - 1].id : undefined;
    return { products, total, latestCursor, hasMore };
  }

  return { products, total };
}

export async function getProductMetadata() {
  // Return cached value if available
  if (metadataCache) return metadataCache;

  const [categoriesResponse, brandsResponse, availabilityStatusesResponse] =
    await Promise.allSettled([
      prisma.product.findMany({
        distinct: ["category"],
        select: { category: true },
      }),
      prisma.product.findMany({
        distinct: ["brand"],
        select: { brand: true },
      }),
      prisma.product.findMany({
        distinct: ["availabilityStatus"],
        select: { availabilityStatus: true },
      }),
    ]);

  metadataCache = {
    categories:
      categoriesResponse.status === "fulfilled"
        ? categoriesResponse.value.map(({ category }) => category)
        : [],
    brands:
      brandsResponse.status === "fulfilled"
        ? brandsResponse.value
            .map(({ brand }) => brand)
            .filter((brand) => brand !== null)
        : [],
    availabilityStatuses:
      availabilityStatusesResponse.status === "fulfilled"
        ? availabilityStatusesResponse.value.map(
            ({ availabilityStatus }) => availabilityStatus,
          )
        : [],
  };

  return metadataCache;
}

export async function getProductDetailsByID(id: number) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { reviews: true },
  });

  return product;
}

export async function getAllCategories() {
  const { categories } = await getProductMetadata();

  const transformedCategories = categories.map((slug: string) => ({
    slug,
    name: formatCategoryName(slug),
  }));

  return transformedCategories;
}

export async function getCategoryMetadata(category: string) {
  const result = await prisma.product.findMany({
    where: {
      category: { equals: category, mode: "insensitive" },
    },
    select: { brand: true, price: true },
  });

  let brands = new Set<string>();
  let minPrice = Infinity;
  let maxPrice = -Infinity;

  for (const product of result) {
    if (product.brand) {
      brands.add(product.brand);
    }

    const price = Number(product.price);
    minPrice = Math.min(price, minPrice);
    maxPrice = Math.max(price, maxPrice);
  }

  return { brands: Array.from(brands), minPrice, maxPrice };
}
