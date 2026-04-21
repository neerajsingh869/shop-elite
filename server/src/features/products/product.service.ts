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

export async function searchProducts(filters: ProductFilters) {
  const where: ProductWhereInput = {
    ...(filters.keyword && {
      title: { contains: filters.keyword, mode: "insensitive" },
    }),
    ...(filters.category && {
      category: { equals: filters.category, mode: "insensitive" },
    }),
    ...(filters.brand && {
      brand: { equals: filters.brand, mode: "insensitive" },
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

  return prisma.product.findMany({
    where,
    orderBy: buildOrderBy(filters.sortBy),
    // TODO: add pagination (skip/take) in next iteration
  });
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
