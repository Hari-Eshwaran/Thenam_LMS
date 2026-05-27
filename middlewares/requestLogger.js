export function requestLogger(req, res, next) {
  const start = Date.now();
  const requestId = req.id || req.headers["x-request-id"] || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  req.id = requestId;

  console.log(
    JSON.stringify({
      level: "info",
      type: "request",
      requestId,
      method: req.method,
      path: req.originalUrl,
      event: "start",
      timestamp: new Date().toISOString(),
    }),
  );

  res.on("finish", () => {
    const ms = Date.now() - start;
    const contentLength = res.getHeader("content-length") || 0;
    console.log(
      JSON.stringify({
        level: res.statusCode >= 500 ? "error" : "info",
        type: "request",
        requestId,
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        durationMs: ms,
        contentLength,
        event: "finish",
        timestamp: new Date().toISOString(),
      }),
    );
  });
  next();
}
