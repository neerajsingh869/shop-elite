import { Router } from "express";

import * as productController from "./product.controller.js";

const router = Router();

router.get("/search", productController.searchProductsHandler);
router.post("/llm-search", productController.llmSearchHandler);

export default router;
