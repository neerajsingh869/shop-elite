import { Router } from "express";

import * as productController from "./product.controller.js";

const router = Router();

router.get("/search", productController.searchProductsHandler);
router.get("/categories", productController.getAllCategoriesHandler);
router.get("/category-metadata", productController.getCategoryMetadataHandler);
router.post("/llm-search", productController.llmSearchHandler);

router.get("/:id", productController.getProductDetailsHandler);

export default router;
