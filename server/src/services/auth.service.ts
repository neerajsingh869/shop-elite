import { prisma } from "../lib/prisma.js";
import { comparePassword, hashPassword, hashToken } from "../utils/hash.js";

import {
  signAccessToken,
  signRefreshToken,
  type TokenPayload,
  verfityRefreshToken,
} from "../utils/jwt.js";

interface User {
  id: string;
  name: string;
  email: string;
}

/*
  Function to create both access and refresh tokens
  along with saving refresh token in DB
*/
async function issueTokens(user: User) {
  const payload: TokenPayload = {
    sub: user.id,
    name: user.name,
    email: user.email,
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  // Store hash of refresh token so that even
  // if DB is breached, the hashes are exposed
  const tokenHash = hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.create({
    data: {
      tokenHash,
      userId: user.id,
      expiresAt,
    },
  });

  return { accessToken, refreshToken };
}

export async function register(name: string, email: string, password: string) {
  // Check if email already exists
  const isExisting = await prisma.user.findUnique({ where: { email: email } });
  if (isExisting) throw new Error("EMAIL_TAKEN");

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
    },
  });

  const tokens = await issueTokens(user);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
    },
    ...tokens,
  };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.passwordHash) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const isValid = await comparePassword(password, user.passwordHash);
  if (!isValid) throw new Error("INVALID_CREDENTIALS");

  const tokens = await issueTokens(user);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
    },
    ...tokens,
  };
}

export async function refresh(rawRefreshToken: string) {
  let payload: TokenPayload;
  // Step 1: Verify JWT Refresh Token
  try {
    payload = verfityRefreshToken(rawRefreshToken);
  } catch {
    throw new Error("INVALID_TOKEN");
  }

  // Step 2: Look up the hash in DB
  const tokenHash = hashToken(rawRefreshToken);
  const stored = await prisma.refreshToken.findUnique({ where: { tokenHash } });
  if (!stored) throw new Error("INVALID_TOKEN");

  // Step 3: If revoked, someone else is using the token
  if (stored.isRevoked) {
    // Revoke all tokens assuming breach since the token is reused
    await prisma.refreshToken.updateMany({
      where: { userId: payload.sub },
      data: { isRevoked: true },
    });

    throw new Error("TOKEN_REUSE");
  }

  if (stored.expiresAt < new Date()) throw new Error("TOKEN_EXPIRED");

  // Step 4: Revoke the expired token
  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { isRevoked: true },
  });

  // Step 5: Issue fresh tokens
  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) throw new Error("USER_NOT_FOUND");

  const tokens = await issueTokens(user);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
    },
    ...tokens,
  };
}

export async function googleAuth(googleAccessToken: string) {
  const response = await fetch(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: {
        Authorization: `Bearer ${googleAccessToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("INVALID_GOOGLE_TOKEN");
  }

  const profile = (await response.json()) as {
    sub: string;
    name: string;
    email: string;
    picture: string;
  };

  let user = await prisma.user.findFirst({
    where: {
      OR: [{ googleId: profile.sub }, { email: profile.email }],
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: profile.email,
        name: profile.name,
        avatarUrl: profile.picture,
        googleId: profile.sub,
      },
    });
  } else if (!user.googleId) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        googleId: profile.sub,
        avatarUrl: profile.picture ?? user.avatarUrl,
      },
    });
  }

  const tokens = await issueTokens(user);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
    },
    ...tokens,
  };
}

export async function logout(rawRefreshToken: string) {
  const tokenHash = hashToken(rawRefreshToken);
  // Mark as revoked (doesn't throw error if no record exists - user is already logged out)
  await prisma.refreshToken.update({
    where: { tokenHash },
    data: { isRevoked: true },
  });
}

export async function getMe(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      createdAt: true,
      // passwordHash is skipped due to security reasons
    },
  });
}
