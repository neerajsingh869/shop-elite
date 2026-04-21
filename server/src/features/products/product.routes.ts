import { Router } from "express";

import * as productController from "./product.controller.js";

const router = Router();

router.get("/search", productController.searchProducts);
router.post("/llm-search", productController.searchProductsUsingLLM);

export default router;
