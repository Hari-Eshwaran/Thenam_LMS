import { fail } from "../utils/apiResponse.js";

export function errorHandler(err, req, res, next) {
  const status = err.statusCode || err.status || 500;
  const isOperational = err.isOperational ?? status < 500;
  const message = err.message || "Internal server error";
  const details = err.details || err.errors || err.reason;

  if (!isOperational || status >= 500) {
    console.error("[api:error]", {
      status,
      message,
      path: req?.originalUrl,
      method: req?.method,
      stack: err?.stack,
    });
  }

  return fail(res, status, message, details);
}
