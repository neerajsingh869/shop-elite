import Razorpay from "razorpay";
import crypto from "crypto";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../shared/errors/AppError.js";
import type { CreateRazorpayOrderInput, VerifyPaymentInput } from "./orders.types.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function createRazorpayOrder(
  orderDetails: CreateRazorpayOrderInput,
  userId?: string,
) {
  const { items, email, phone, totalAmount } = orderDetails;

  // fetch real prices from DB and compute backend total
  let backendTotal = 0;
  const enrichedItems = [];

  for (const { productId, quantity } of items) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new AppError(`Product ${productId} not found`, 404);
    const pricePerUnit = Number(product.price);
    const totalPrice = pricePerUnit * quantity;
    backendTotal += totalPrice;
    enrichedItems.push({
      productId,
      title: product.title,
      thumbnail: product.thumbnail,
      quantity,
      pricePerUnit,
      totalPrice,
    });
  }

  // validate frontend total against backend total
  if (Math.abs(totalAmount - backendTotal) > 0.01) {
    throw new AppError("Total amount mismatch", 400);
  }

  // create Razorpay order — amount in paise
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(backendTotal * 100),
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  });

  // save pending order to DB
  const order = await prisma.order.create({
    data: {
      razorpayOrderId: razorpayOrder.id,
      totalAmount: backendTotal,
      status: "PENDING",
      email,
      phone,
      userId: userId ?? null,
      items: {
        create: enrichedItems,
      },
    },
  });

  return {
    orderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
  };
}

export async function verifyPayment(razorpayDetails: VerifyPaymentInput) {
  const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = razorpayDetails;

  // verify HMAC signature
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  const isValid = expectedSignature === razorpaySignature;

  if (!isValid) {
    // mark order as failed
    await prisma.order.update({
      where: { razorpayOrderId },
      data: { status: "FAILED" },
    });
    throw new AppError("Payment verification failed — signature mismatch", 400);
  }

  // update order to PAID
  const order = await prisma.order.update({
    where: { razorpayOrderId },
    data: {
      status: "PAID",
      paymentId: razorpayPaymentId,
    },
  });

  // send email — failure never affects payment success
  try {
    // await sendOrderConfirmationEmail(order.email, order)
    console.log("Email sent to:", order.email);
  } catch (error) {
    console.error("Email notification failed:", error);
  }

  // send SMS — failure never affects payment success
  try {
    // await sendOrderConfirmationSMS(order.phone, order)
    console.log("SMS sent to:", order.phone);
  } catch (error) {
    console.error("SMS notification failed:", error);
  }

  return { success: true, orderId: order.id };
}