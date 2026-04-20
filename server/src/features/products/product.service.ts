import {
  ProductOrderByWithRelationInput,
  ProductWhereInput,
} from "../../generated/prisma/models.js";

import { prisma } from "../../lib/prisma.js";
import { ProductFilters } from "./product.types.js";

function getOrderBy(
  sortBy: ProductFilters["sortBy"],
): ProductOrderByWithRelationInput {
  switch (sortBy) {
    case "discount_desc":
      return { discountPercentage: "desc" };
    case "price_asc":
      return { price: "asc" };
    case "price_desc":
      return { price: "desc" };
    case "rating_desc":
      return { rating: "desc" };
    default:
      return { id: "asc" };
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
    ...((filters.minPrice || filters.maxPrice) && {
      price: {
        ...(filters.minPrice && { gte: filters.minPrice }),
        ...(filters.maxPrice && { lte: filters.maxPrice }),
      },
    }),
    ...(filters.minDiscount && {
      discountPercentage: { gte: filters.minDiscount },
    }),
    ...(filters.minRating && {
      rating: { gte: filters.minRating },
    }),
  };

  const products = await prisma.product.findMany({
    where,
    orderBy: getOrderBy(filters.sortBy),
  });

  return products;
}
