import { z } from "zod";

export const createRazorpayOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1, "Cart cannot be empty"),
  email: z.email(),
  phone: z.string().optional(),
  totalAmount: z.number().positive(),
});

export const verifyPaymentSchema = z.object({
  razorpayPaymentId: z.string(),
  razorpayOrderId: z.string(),
  razorpaySignature: z.string(),
});

export type CreateRazorpayOrderInput = z.infer<
  typeof createRazorpayOrderSchema
>;
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
