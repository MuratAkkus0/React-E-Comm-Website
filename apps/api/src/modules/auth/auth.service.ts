import bcrypt from "bcryptjs";
import type { RegisterInput, LoginInput } from "@ecomm/shared";
import { ConflictError, UnauthorizedError } from "../../lib/errors.js";
import * as authRepository from "./auth.repository.js";
import {
  generateRefreshToken,
  hashToken,
  refreshTokenExpiry,
  signAccessToken,
} from "./tokens.js";

const BCRYPT_ROUNDS = 12;

function toPublicUser(user: { id: number; email: string; name: string; role: "USER" | "ADMIN" }) {
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

async function issueTokenPair(user: { id: number; role: "USER" | "ADMIN" }) {
  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = generateRefreshToken();

  await authRepository.storeRefreshToken({
    userId: user.id,
    tokenHash: hashToken(refreshToken),
    expiresAt: refreshTokenExpiry(),
  });

  return { accessToken, refreshToken };
}

export async function register(input: RegisterInput) {
  const existing = await authRepository.findUserByEmail(input.email);
  if (existing) {
    throw new ConflictError("An account with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
  const user = await authRepository.createUser({
    email: input.email,
    passwordHash,
    name: input.name,
  });

  const tokens = await issueTokenPair(user);
  return { user: toPublicUser(user), ...tokens };
}

export async function login(input: LoginInput) {
  const user = await authRepository.findUserByEmail(input.email);
  const isValid = user ? await bcrypt.compare(input.password, user.passwordHash) : false;

  // Same generic response whether the email exists or the password is
  // wrong, so we never leak which emails are registered.
  if (!user || !isValid) {
    throw new UnauthorizedError("Invalid email or password.");
  }

  const tokens = await issueTokenPair(user);
  return { user: toPublicUser(user), ...tokens };
}

export async function refresh(presentedToken: string | undefined) {
  if (!presentedToken) {
    throw new UnauthorizedError("No refresh token provided.");
  }

  const tokenHash = hashToken(presentedToken);
  const stored = await authRepository.findRefreshTokenByHash(tokenHash);

  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    throw new UnauthorizedError("Invalid or expired refresh token.");
  }

  const user = await authRepository.findUserById(stored.userId);
  if (!user) {
    throw new UnauthorizedError("Invalid or expired refresh token.");
  }

  // Rotate: the old refresh token is revoked as soon as it is used once,
  // so a stolen-but-unused token cannot be replayed after the legitimate
  // client has refreshed.
  await authRepository.revokeRefreshToken(stored.id);
  const tokens = await issueTokenPair(user);
  return { user: toPublicUser(user), ...tokens };
}

export async function logout(presentedToken: string | undefined) {
  if (!presentedToken) return;
  const stored = await authRepository.findRefreshTokenByHash(hashToken(presentedToken));
  if (stored && !stored.revokedAt) {
    await authRepository.revokeRefreshToken(stored.id);
  }
}

export async function getProfile(userId: number) {
  const user = await authRepository.findUserById(userId);
  if (!user) {
    throw new UnauthorizedError();
  }
  return toPublicUser(user);
}
