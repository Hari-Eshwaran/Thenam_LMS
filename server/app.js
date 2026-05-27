import express from "express";
import cors from "cors";

import apiRouter from "../routes/index.js";
import { AppError } from "../utils/appError.js";
import { ok } from "../utils/apiResponse.js";
import { requestLogger } from "../middlewares/requestLogger.js";
import { requestSanitizer } from "../middlewares/requestSanitizer.js";
import { rateLimit } from "../middlewares/rateLimit.js";
import { securityHeaders } from "../middlewares/securityHeaders.js";
import { errorHandler } from "../middlewares/errorHandler.js";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  );
  app.use(securityHeaders);
  app.use(rateLimit({ windowMs: 60_000, max: 300 }));
  app.use(express.json({ limit: "1mb" }));
  app.use(requestSanitizer);
  app.use(requestLogger);

  app.get("/api/health", (req, res) => {
    return ok(res, {
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  app.use("/api", apiRouter);
  app.use("/api/v1", apiRouter);

  app.use((req, res, next) => {
    next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
  });

  app.use(errorHandler);

  return app;
}

