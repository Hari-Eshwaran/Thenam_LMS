const store = new Map();

export function getCache(key) {
  const entry = store.get(key);
  if (!entry) {
    return undefined;
  }

  if (entry.expiresAt && entry.expiresAt <= Date.now()) {
    store.delete(key);
    return undefined;
  }

  return entry.value;
}

export function setCache(key, value, ttlMs = 60_000) {
  store.set(key, {
    value,
    expiresAt: ttlMs ? Date.now() + ttlMs : null,
  });
  return value;
}

export function deleteCache(key) {
  return store.delete(key);
}

export function clearCache(prefix) {
  for (const key of store.keys()) {
    if (!prefix || key.startsWith(prefix)) {
      store.delete(key);
    }
  }
}
