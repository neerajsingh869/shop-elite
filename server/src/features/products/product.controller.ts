import { Request, Response } from "express";

import * as productService from "./product.service.js";
import { ProductFilters } from "./product.types.js";
import { extractFiltersFromQuery } from "./product.llm.js";

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

// GET /api/products/search?keyword=laptop&maxPrice=1000
export async function searchProductsHandler(req: Request, res: Response) {
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
    console.error("Search failed:", err);
    res.status(500).json({ message: "Search failed. Please try again." });
  }
}

// POST /api/products/llm-search
// Body: { userQuery: "apple laptops under 2000" }
export async function llmSearchHandler(req: Request, res: Response) {
  const { userQuery } = req.body;

  if (!userQuery) {
    res.status(400).json({ message: "User query is required" });
    return;
  }

  try {
    const { filters, llmFailed } = await extractFiltersFromQuery(userQuery);
    const products = await productService.searchProducts(filters);
    res.json({ products, filters, llmFailed }); // return filters so frontend can show "Searching for..."
  } catch (err) {
    console.error("LLM search failed:", err);
    res.status(500).json({ message: "Search failed. Please try again." });
  }
}
