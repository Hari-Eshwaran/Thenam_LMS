function buildSuccessPayload(data, meta, message) {
  const payload = {
    success: true,
    message,
    data,
  };

  if (meta !== undefined) {
    payload.meta = meta;
  }

  return payload;
}

function normalizeDetails(details) {
  if (details == null) {
    return undefined;
  }

  if (Array.isArray(details)) {
    return details;
  }

  if (details instanceof Error) {
    return [details.message];
  }

  if (typeof details === "object") {
    return [details];
  }

  return [String(details)];
}

export function ok(res, data, meta, message = "Request successful.") {
  return res.status(200).json(buildSuccessPayload(data, meta, message));
}

export function created(res, data, meta, message = "Resource created successfully.") {
  return res.status(201).json(buildSuccessPayload(data, meta, message));
}

export function fail(res, statusCode, message, details) {
  const payload = {
    success: false,
    error: message,
  };

  const normalizedDetails = normalizeDetails(details);
  if (normalizedDetails !== undefined) {
    payload.details = normalizedDetails;
  }

  return res.status(statusCode).json(payload);
}
