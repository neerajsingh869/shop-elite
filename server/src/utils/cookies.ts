import type { Request, Response } from "express";
import { env } from "../config/env.js";

const COOKIE_NAME = "shopelite-rt";

export function setRefreshTokenCookie(res: Response, token: string): void {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true, // JavaScript cannot read this cookie
    secure: env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "strict", // Not sent on cross-site requests
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    path: "/api/auth", // Cookie only sent to auth routes
  });
}

export function clearRefreshTokenCookie(res: Response): void {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true, // JavaScript cannot read this cookie
    secure: env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "strict", // Not sent on cross-site requests
    path: "/api/auth", // Cookie only sent to auth routes
  });
}

export function getRefreshToken(req: Request): string | undefined {
  return req.cookies[COOKIE_NAME];
}
