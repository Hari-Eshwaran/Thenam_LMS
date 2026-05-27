export class AppError extends Error {
  constructor(message, statusCode = 500, details, options = {}) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = options.isOperational ?? true;

    if (options.cause) {
      this.cause = options.cause;
    }
  }
}

export function isAppError(error) {
  return error instanceof AppError;
}
