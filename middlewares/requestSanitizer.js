import { AppError } from "../utils/appError.js";

function sanitizeValue(value, path = []) {
  if (Array.isArray(value)) {
    return value.map((item, index) => sanitizeValue(item, [...path, String(index)]));
  }

  if (value && typeof value === "object") {
    const output = {};
    for (const [key, childValue] of Object.entries(value)) {
      if (key.startsWith("$") || key.includes(".")) {
        throw new AppError(`Unsafe key detected at ${[...path, key].join(".")}.`, 400);
      }
      output[key] = sanitizeValue(childValue, [...path, key]);
    }
    return output;
  }

  if (typeof value === "string") {
    return value.replace(/<script[^>]*>.*?<\/script>/gi, "").trim();
  }

  return value;
}

export function requestSanitizer(req, res, next) {
  try {
    if (req.body && Object.keys(req.body).length) {
      req.body = sanitizeValue(req.body);
    }
    if (req.query && Object.keys(req.query).length) {
      req.query = sanitizeValue(req.query);
    }
    if (req.params && Object.keys(req.params).length) {
      req.params = sanitizeValue(req.params);
    }
    next();
  } catch (error) {
    next(error);
  }
}
