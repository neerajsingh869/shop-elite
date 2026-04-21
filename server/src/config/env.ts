import dotenv from "dotenv";
import { z } from "zod";

// Load .env file into process.env
dotenv.config();

// Define the schema of what env vars we expect
const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  ACCESS_TOKEN_SECRET: z.string().min(32, "Must be at least 32 characters"),
  REFRESH_TOKEN_SECRET: z.string().min(32, "Must be at least 32 characters"),
  ACCESS_TOKEN_EXPIRY: z.string().default("15m"),
  REFRESH_TOKEN_EXPIRY: z.string().default("7d"),
  PORT: z.string().default("4000"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  CLIENT_URL: z.string().default("http://localhost:5173"),
  GROQ_API_KEY: z.string()
});

// safeParse returns { success, data, error } instead of throwing
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Missing or invalid environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1); // stop the server immediately
}

export const env = parsed.data;
