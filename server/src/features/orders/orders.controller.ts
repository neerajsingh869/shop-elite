import type { Request, Response } from "express";
import * as ordersService from "./orders.service.js";
import { createRazorpayOrderSchema, verifyPaymentSchema } from "./orders.types.js";
import { AppError } from "../../shared/errors/AppError.js";

export async function createRazorpayOrderHandler(req: Request, res: Response) {
  try {
    const parsed = createRazorpayOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Invalid request", errors: parsed.error.flatten() });
      return;
    }
    const userId = (req as any).user?.id;
    const result = await ordersService.createRazorpayOrder(parsed.data, userId);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function verifyPaymentHandler(req: Request, res: Response) {
  try {
    const parsed = verifyPaymentSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Invalid request", errors: parsed.error.flatten() });
      return;
    }
    const result = await ordersService.verifyPayment(parsed.data);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: "Internal server error" });
  }
}