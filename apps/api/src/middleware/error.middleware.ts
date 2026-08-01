import type { NextFunction, Request, Response } from "express";
import { logger } from "../config/logger.js";
import { AppError } from "../lib/errors.js";

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// Centralized error handler. Keeps stack traces and internal error details
// server-side only; clients always get a generic message unless the error
// is one of our own known/expected AppError instances.
export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof AppError) {
    if (err.status >= 500) {
      logger.error({ err }, err.message);
    }
    return res.status(err.status).json({ message: err.message });
  }

  logger.error({ err }, "Unhandled error");
  res.status(500).json({ message: "Internal server error." });
}
