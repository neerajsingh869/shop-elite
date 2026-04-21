import { Request, Response } from "express";

import * as productService from "./product.service.js";
import { ProductFilters } from "./product.types.js";

const VALID_SORT_VALUES = [
  "price_asc",
  "price_desc",
  "rating_desc",
  "discount_desc",
] as const;

function getString(val: unknown): string | undefined {
  return typeof val === "string" ? val : undefined;
}

function getNumber(val: unknown): number | undefined {
  const str = getString(val);
  if (!str) return undefined;
  const num = Number(str);
  return isNaN(num) ? undefined : num;
}

function getSortBy(val: unknown): ProductFilters["sortBy"] {
  const str = getString(val);
  return VALID_SORT_VALUES.includes(str as any)
    ? (str as ProductFilters["sortBy"])
    : undefined;
}

export async function searchProducts(req: Request, res: Response) {
  const q = req.query;

  const filters: ProductFilters = {
    keyword: getString(q.keyword),
    category: getString(q.category),
    brand: getString(q.brand),
    availabilityStatus: getString(q.availabilityStatus),
    minPrice: getNumber(q.minPrice),
    maxPrice: getNumber(q.maxPrice),
    minDiscount: getNumber(q.minDiscount),
    minRating: getNumber(q.minRating),
    sortBy: getSortBy(q.sortBy),
  };

  try {
    const products = await productService.searchProducts(filters);
    res.json({ products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
}
