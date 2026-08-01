/**
 * Domain error hierarchy. Every thrown error the API considers "expected"
 * (bad input, missing resource, illegal state transition, auth failure)
 * extends AppError and carries the HTTP status it maps to. The central
 * error handler (middleware/error.middleware.ts) trusts `expose = true`
 * errors to render their message to the client; anything else becomes a
 * generic 500 so internal details never leak.
 */
export class AppError extends Error {
  readonly status: number;
  readonly expose = true;

  constructor(status: number, message: string) {
    super(message);
    this.name = new.target.name;
    this.status = status;
    Error.captureStackTrace?.(this, new.target);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request.") {
    super(400, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Authentication required.") {
    super(401, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "You do not have permission to do this.") {
    super(403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found.") {
    super(404, message);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict.") {
    super(409, message);
  }
}
