import { Request, Response } from "express";

import * as ordersService from "./orders.service.js";

import * as orders

export async function createRazorpayOrderHandler(req: Request, res: Response) {
  const {items, totalAmount, email, phone} = req.body;

  
}

export async function verifyPaymentHandler(req: Request, res: Response) {}
