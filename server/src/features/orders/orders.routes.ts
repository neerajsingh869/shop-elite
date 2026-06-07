import { Router } from "express";

import * as ordersController from "./orders.controller.js";

const router = Router();

router.post(
  "/create-razorpay-order",
  ordersController.createRazorpayOrderHandler,
);
router.post("/verify-payment", ordersController.verifyPaymentHandler);

export default router;
