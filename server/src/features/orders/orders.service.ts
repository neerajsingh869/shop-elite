import Razorpay from "razorpay";
import crypto from "crypto";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../shared/errors/AppError.js";
import {
  CreateRazorpayOrderInput,
  VerifyPaymentInput,
} from "./orders.types.js";
import { success } from "zod";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function createRazorpayOrder(
  orderDetails: CreateRazorpayOrderInput,
) {
  const { items, email, phone, totalAmount } = orderDetails;

  // YOUR LOGIC: fetch real prices from DB for each productId
  // YOUR LOGIC: compute backendTotal
  let backendTotal = 0;
  for (const { productId, quantity } of items) {
    const price = await prisma.product.findUnique({ where: { id: productId } });
    backendTotal += Number(price) * quantity;
  }

  // YOUR LOGIC: compare with totalAmount, throw if mismatch
  if (totalAmount !== backendTotal) {
    throw new AppError("Total amount mismatch", 400);
  }
  // YOUR LOGIC: call Razorpay API to create order with backendTotal
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(backendTotal) * 100 * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  });

  // YOUR LOGIC: create pending Order in DB with:
  // razorpayOrderId, totalAmount: backendTotal, email, phone, userId, items[]
  // each OrderItem: productId, title, thumbnail, quantity, pricePerUnit, totalPrice

  return {
    orderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
  };
  // return { orderId, amount, currency, keyId }
}

export async function verifyPayment(razorpayDetails: VerifyPaymentInput) {
  const { razorpayPaymentId, razorpayOrderId, razorpaySignature } =
    razorpayDetails;

  // YOUR LOGIC: recompute HMAC-SHA256 signature
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");
  // YOUR LOGIC: compare with received signature
  const isValid = expectedSignature === razorpaySignature;
  // YOUR LOGIC: if mismatch → update order status to FAILED, throw error
  if (!isValid) {
    throw new AppError("Signature doesn't match", 400);
  }
  // YOUR LOGIC: find order by razorpayOrderId
  // YOUR LOGIC: update order status to PAID, set paymentId
  await prisma.order.update({
    where: { razorpayOrderId },
    data: {
      status: "PAID",
      paymentId: razorpayPaymentId,
    },
  });

  // notification failures never affect payment success
  try {
    // YOUR LOGIC: call sendOrderConfirmationEmail
  } catch (error) {
    console.error("Email notification failed:", error);
  }

  try {
    // YOUR LOGIC: call sendOrderConfirmationSMS
  } catch (error) {
    console.error("SMS notification failed:", error);
  }

  // YOUR LOGIC: return { success: true, orderId }
  return { success: true, orderId: razorpayOrderId };
}
