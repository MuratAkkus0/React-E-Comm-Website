import type { NextFunction, Request, Response } from "express";
import { UnauthorizedError, ForbiddenError } from "../lib/errors.js";
import { verifyAccessToken } from "../modules/auth/tokens.js";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new UnauthorizedError("No access token provided."));
  }

  const token = authHeader.slice("Bearer ".length).trim();

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    next(new UnauthorizedError("Invalid or expired access token."));
  }
}

/**
 * Populates req.user when a valid access token is present, but never
 * rejects the request otherwise. Used on routes that are public but
 * behave differently for a logged-in admin (e.g. the product listing
 * exposing inactive products to admins managing the catalog).
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.slice("Bearer ".length).trim();
  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role };
  } catch {
    // Ignore invalid/expired tokens on optional routes.
  }
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return next(new UnauthorizedError());
  }
  if (req.user.role !== "ADMIN") {
    return next(new ForbiddenError("Admin access required."));
  }
  next();
}
