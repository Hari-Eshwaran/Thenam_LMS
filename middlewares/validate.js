import { ZodError } from "zod";

import { AppError } from "../utils/appError.js";

function formatZodError(error) {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
    code: issue.code,
  }));
}

function validateSchema(schema, value, source) {
  if (!schema) {
    return value;
  }

  const result = schema.safeParse(value);
  if (!result.success) {
    throw new AppError(`Invalid ${source}.`, 400, formatZodError(result.error));
  }

  return result.data;
}

export function validateRequest({ body, query, params } = {}) {
  return (req, res, next) => {
    try {
      if (body) {
        req.body = validateSchema(body, req.body, "request body");
      }
      if (query) {
        req.query = validateSchema(query, req.query, "query string");
      }
      if (params) {
        req.params = validateSchema(params, req.params, "route params");
      }
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(new AppError("Invalid request.", 400, formatZodError(error)));
      }
      return next(error);
    }
  };
}
