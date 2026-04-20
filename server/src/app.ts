import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import { env } from "./config/env.js";
import authRoutes from "./features/auth/auth.routes.js";

const app = express();

// Add security headers
app.use(helmet());

// cors allow communication between client and server on different origin
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true, // required for cookies to be sent cross-origin
  }),
);

// parse incoming JSON request bodies in req.body
// without this, req.body will be undefined
app.use(express.json({ limit: "10kb" })); // limit prevents huge payloads

// parse cookies from request headers into req.cookies
// without this, req.cookies will be undefined
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

export default app;
