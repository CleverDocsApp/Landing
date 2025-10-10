const ipRequestMap = new Map<string, number[]>();

const RATE_LIMIT_WINDOW_MS = 60000;
const MAX_REQUESTS_PER_WINDOW = 10;

export const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const requests = ipRequestMap.get(ip) || [];

  const recentRequests = requests.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
  );

  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  recentRequests.push(now);
  ipRequestMap.set(ip, recentRequests);

  cleanupOldEntries();

  return true;
};

const cleanupOldEntries = () => {
  const now = Date.now();

  for (const [ip, requests] of ipRequestMap.entries()) {
    const recentRequests = requests.filter(
      (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
    );

    if (recentRequests.length === 0) {
      ipRequestMap.delete(ip);
    } else {
      ipRequestMap.set(ip, recentRequests);
    }
  }
};
