import Groq from "groq-sdk";

import { env } from "../../config/env.js";
import { getProductMetadata } from "./product.service.js";
import { ProductFilters } from "./product.types.js";

const groq = new Groq({ apiKey: env.GROQ_API_KEY });

function extractJson(text: string): string {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1)
    throw new Error("No JSON found in LLM response");
  return text.substring(start, end + 1);
}

function buildSystemPrompt(metadata: {
  categories: string[];
  brands: string[];
  availabilityStatuses: string[];
}): string {
  return `You are a product search filter extractor for an ecommerce store.

  Given a user's natural language search query, extract structured filters and return ONLY a valid JSON object. 
  No explanation, no markdown, no extra text — just the raw JSON.

  Return only the fields you can confidently extract. Omit fields you cannot determine.

  JSON shape:
  {
    "keyword": string,           // main product user is searching (must be part of user query) for e.g. "laptop", "dress", "phone", etc
    "category": string,          // must be one of: ${JSON.stringify(metadata.categories)}
    "brand": string,             // must be one of: ${JSON.stringify(metadata.brands)}
    "minPrice": number,          // minimum price in USD
    "maxPrice": number,          // maximum price in USD
    "minDiscount": number,       // minimum discount percentage e.g. 20 for 20% off
    "minRating": number,         // minimum rating e.g. 4 for 4+ stars
    "availabilityStatus": string, // must be one of: ${JSON.stringify(metadata.availabilityStatuses)}
    "sortBy": "price_asc" | "price_desc" | "rating_desc" | "discount_desc"
  }

  Examples:
  User: "cheap apple laptops" → {"keyword":"laptop","category":"laptops","brand":"Apple","sortBy":"price_asc"}
  User: "highly rated beauty under 50" → {"keyword":"beauty","category":"beauty","maxPrice":50,"sortBy":"rating_desc"}
  User: "in stock samsung phones" → {"keyword":"phone","brand":"Samsung","availabilityStatus":"In Stock"}`;
}

export async function extractFiltersFromQuery(
  userQuery: string,
): Promise<{ filters: ProductFilters; llmFailed: boolean }> {
  if (!userQuery?.trim()) return { filters: {}, llmFailed: false };

  try {
    const metadata = await getProductMetadata();

    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      temperature: 0, // deterministic output — to get consistent JSON & ignoring creativity
      messages: [
        { role: "system", content: buildSystemPrompt(metadata) },
        { role: "user", content: userQuery },
      ],
    });

    const rawOutput = response.choices[0]?.message?.content ?? "";
    if (!rawOutput) return { filters: {}, llmFailed: false };

    const jsonString = extractJson(rawOutput);
    return {
      filters: JSON.parse(jsonString) as ProductFilters,
      llmFailed: false,
    };
  } catch (err) {
    // Fallback to empty filters — search still works, just without LLM extraction
    console.error("LLM filter extraction failed:", err);
    return { filters: { keyword: userQuery }, llmFailed: true };
  }
}
