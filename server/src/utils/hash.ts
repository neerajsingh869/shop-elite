import bcrypt from "bcryptjs";
import { createHash } from "crypto";

const SALT_ROUND = 12;

// Hash a password before storing in database
// bcrypt.hash generates a random salt internally and mixes it in
// The salt is stored AS PART of the hash string
export async function hashPassword(plainText: string): Promise<string> {
  return bcrypt.hash(plainText, SALT_ROUND);
}

// Compare a plain text password against a stored hash
// bcrypt extracts the salt from the stored hash, re-hashes the input, compares
// Returns true if they match, false if not
export async function comparePassword(
  plainText: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(plainText, hash);
}

// Hash a refresh token before storing in database
// We use SHA-256 here, not bcrypt - here's why:
// Refresh tokens are random (high entropy) - not guessable like passwords
// bcrypt is slow by design - we don't need that for random tokens
// SHA-256 is fine here because rainbow tables don't work on random values
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
