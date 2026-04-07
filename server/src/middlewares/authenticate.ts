import { Request, Response, NextFunction } from "express";
import { TokenPayload, verfityAccessToken } from "../utils/jwt.js";

// Let TS know req.user exists after the middleware runs
export interface AuthRequest extends Request {
  user: TokenPayload;
}

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // Token will come in Authorization header as "Bearer <token>"
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  // Split `authHeader` and extract token
  const token = authHeader.split(" ")[1];

  try {
    const payload = verfityAccessToken(token);

    // Attach user data to request so route handles can use it
    (req as AuthRequest).user = payload;
    next(); // Move to the actual route handler
  } catch {
    // verfityAccessToken throws for invalid or expired tokens
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
