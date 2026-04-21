import Groq from "groq-sdk";

import { env } from "../../config/env.js";
import * as productService from "./product.service.js";
import { ProductFilters } from "./product.types.js";

const groq = new Groq({ apiKey: env.GROQ_API_KEY });

export async function extractFiltersFromQuery(
  userQuery: string,
): Promise<ProductFilters> {
  const productsMetadata = await productService.getProductMetadata();
  // construct system prompt and call groq api
  const systemPrompt = `You need to generate JSON object for product filters on the basis of 
  user's query that we will pass as input. The returned response will be a JSON object with below shape
  {keyword?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minDiscount?: number;
  minRating?: number;
  availabilityStatus?: string;
  sortBy?: "price_asc" | "price_desc" | "rating_desc" | "discount_desc"}. Here ? indicates that these fields
  are optional. Your job is to return JSON object that contains only the fields that value you can extract from user's query.
  Your response should be ready to be used by JSON.parse and should not throw any error.
  
  A category can have any value in ${productsMetadata.categories} array
  A brand can have any value in ${productsMetadata.brands} array
  An availabilityStatus can have any value in ${productsMetadata.availabilityStatuses} array`;

  const llmResponse = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userQuery,
      },
    ],
    model: "openai/gpt-oss-20b",
  });

  const llmOutput = llmResponse.choices[0]?.message?.content || "";
  try {
    let productFilters = {};
    if (llmOutput !== "") {
      productFilters = JSON.parse(
        llmOutput.substring(
          llmOutput.indexOf("{"),
          llmOutput.lastIndexOf("}") + 1,
        ),
      );
    }

    return productFilters;
  } catch (err) {
    console.error(err);
    return {};
  }
}
