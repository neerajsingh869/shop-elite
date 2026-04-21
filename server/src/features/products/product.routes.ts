import { Router } from "express";

import * as productController from "./product.controller.js";

const router = Router();

router.get("/search", productController.searchProducts);

export default router;
