import { raw, Request, Response } from "express";

import * as authService from "./auth.service.js";
import {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
  getRefreshToken,
} from "../../utils/cookies.js";
import { AuthRequest } from "../../middlewares/authenticate.js";

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: "name, email and password are required" });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({ message: "Password must be at least 8 characters" });
    return;
  }

  try {
    const result = await authService.register(name, email, password);
    setRefreshTokenCookie(res, result.refreshToken);
    res
      .status(201)
      .json({ user: result.user, accessToken: result.accessToken });
  } catch (err) {
    if (err instanceof Error && err.message === "EMAIL_TAKEN") {
      res
        .status(409)
        .json({ message: "An account with this email already exists" });
      return;
    }

    res.status(500).json({ message: "Something went wrong" });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "email and password are required" });
    return;
  }

  try {
    const result = await authService.login(email, password);
    setRefreshTokenCookie(res, result.refreshToken);
    res.json({ user: result.user, accessToken: result.accessToken });
  } catch (err) {
    if (err instanceof Error && err.message === "INVALID_CREDENTIALS") {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    res.status(500).json({ message: "Something went wrong" });
  }
}

export async function refresh(req: Request, res: Response) {
  const rawToken = getRefreshToken(req);

  if (!rawToken) {
    res.status(401).json({ message: "No refresh token" });
    return;
  }

  try {
    const result = await authService.refresh(rawToken);
    setRefreshTokenCookie(res, result.refreshToken);
    res.json({ user: result.user, accessToken: result.accessToken });
  } catch (err) {
    clearRefreshTokenCookie(res);
    if (err instanceof Error && err.message === "TOKEN_REUSE") {
      res.status(401).json({ message: "Security alert: please log in again" });
      return;
    }

    res.status(401).json({ message: "Session expired" });
  }
}

export async function googleAuth(req: Request, res: Response) {
  const { accessToken } = req.body;

  if (!accessToken) {
    res.status(400).json({ message: "Google access token is required" });
    return;
  }

  try {
    const result = await authService.googleAuth(accessToken);
    setRefreshTokenCookie(res, result.refreshToken);
    res.json({ user: result.user, accessToken: result.accessToken });
  } catch (err) {
    if (err instanceof Error && err.message === "INVALID_GOOGLE_TOKEN") {
      res.status(401).json({ message: "Invalid google token" });
      return;
    }
    res.status(500).json({ message: "Google authentication failed" });
  }
}

export async function logout(req: Request, res: Response) {
  const rawToken = getRefreshToken(req);

  if (rawToken) await authService.logout(rawToken);
  clearRefreshTokenCookie(res);
  res.json({ message: "Logged out" });
}

export async function getMe(req: Request, res: Response) {
  const authReq = req as AuthRequest;
  const user = await authService.getMe(authReq.user.sub);

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.json({ user });
}
