import type { NextFunction, Request, Response } from "express";
import { env } from "../../config/env.js";
import * as authService from "./auth.service.js";

const REFRESH_COOKIE_NAME = "refreshToken";

const refreshCookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/api/auth",
  maxAge: env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
};

function sendAuthResponse(
  res: Response,
  result: { user: unknown; accessToken: string; refreshToken: string },
  status = 200,
) {
  res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, refreshCookieOptions);
  res.status(status).json({ user: result.user, accessToken: result.accessToken });
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.register(req.body);
    sendAuthResponse(res, result, 201);
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.login(req.body);
    sendAuthResponse(res, result);
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const presentedToken = req.cookies?.[REFRESH_COOKIE_NAME];
    const result = await authService.refresh(presentedToken);
    sendAuthResponse(res, result);
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const presentedToken = req.cookies?.[REFRESH_COOKIE_NAME];
    await authService.logout(presentedToken);
    res.clearCookie(REFRESH_COOKIE_NAME, { path: "/api/auth" });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await authService.getProfile(req.user!.id);
    res.json({ user });
  } catch (err) {
    next(err);
  }
}
