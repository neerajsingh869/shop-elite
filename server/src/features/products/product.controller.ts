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
    brand: q.brand
      ? Array.isArray(q.brand)
        ? (q.brand as string[])
        : (q.brand as string)
      : undefined,
    availabilityStatus: getString(q.availabilityStatus),
    minPrice: getNumber(q.minPrice),
    maxPrice: getNumber(q.maxPrice),
    minDiscount: getNumber(q.minDiscount),
    minRating: getNumber(q.minRating),
    sortBy: getSortBy(q.sortBy),
  };

  let pagination;
  if (q.limit || q.page) {
    const limit = getNumber(q.limit);
    const page = getNumber(q.page);
    pagination = { page: page ?? 1, limit: limit ?? 12 };
  }

  try {
    const { products, total } = await productService.searchProducts(
      filters,
      pagination,
    );

    res.json({
      products,
      total,
      ...(pagination && {
        limit: pagination.limit,
        page: pagination.page,
        totalPages: Math.ceil(total / pagination.limit),
      }),
    });
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
    const { products } = await productService.searchProducts(filters);
    res.json({ products, filters, llmFailed }); // return filters so frontend can show "Searching for..."
  } catch (err) {
    console.error("LLM search failed:", err);
    res.status(500).json({ message: "Search failed. Please try again." });
  }
}

export async function getAllCategoriesHandler(req: Request, res: Response) {
  try {
    const categories = await productService.getAllCategories();
    res.json(categories);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Facing problem in fetching products categories" });
  }
}

export async function getProductDetailsHandler(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid product ID" });
    return;
  }

  try {
    const productDetails = await productService.getProductDetailsByID(id);
    if (!productDetails) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json({ ...productDetails });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Facing problem in fetching product details" });
  }
}

export async function getCategoryMetadataHandler(req: Request, res: Response) {
  const q = req.query;
  const category = getString(q.category);

  if (!category) {
    res.status(400).json({ message: "Category is required" });
    return;
  }

  try {
    const categoryMetadata = await productService.getCategoryMetadata(category);
    res.json(categoryMetadata);
  } catch (err) {
    console.error("Error in getting category metadata: ", err);
    res
      .status(500)
      .json({ message: "Facing problem in fetching category metadata" });
  }
}
