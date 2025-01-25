// This approach may not be suitable for many use cases, especially in serverless environments
// To address this limitation, we can consider using Upstash or a similar solution

interface RateLimit {
  key: string;
  count: number;
  lastRequest: number;
}
const storage = new Map<string, RateLimit>();

export const shouldRateLimit = (method: string, request: Request) => {
  const key = getIp(request) + method;
  const data = storage.get(key);
  const now = Date.now();
  const window = 60;
  const max = 5;

  if (!data) {
    storage.set(key, {
      key,
      count: 1,
      lastRequest: now,
    });
  } else {
    const timeSinceLastRequest = now - data.lastRequest;
    const windowInMs = window * 1000;
    if (timeSinceLastRequest < windowInMs && data.count >= max) {
      return { success: true };
    } else if (timeSinceLastRequest > window * 1000) {
      storage.set(key, {
        ...data,
        count: 1,
        lastRequest: now,
      });
    } else {
      storage.set(key, {
        ...data,
        count: data.count + 1,
        lastRequest: now,
      });
    }
  }
  return { success: false };
};

export function getIp(req: Request) {
  const keys = ["x-forwarded-for", "x-client-ip"];
  for (const key of keys) {
    const value = req.headers.get(key);
    if (typeof value === "string") {
      const ip = value.split(",")[0].trim();
      if (ip) return ip;
    }
  }
  return null;
}
