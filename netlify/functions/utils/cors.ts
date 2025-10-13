export const PREVIEW_RE = /^https:\/\/[a-z0-9-]+--onkliniclp\.netlify\.app$/i;

function parseOrigins() {
  const raw = process.env.ALLOWED_ORIGINS || "";
  return raw.split(",").map(s => s.trim()).filter(Boolean);
}

export function isAllowedOrigin(origin?: string | null): boolean {
  if (!origin) return true;
  const wl = parseOrigins();
  if (wl.includes(origin)) return true;
  return PREVIEW_RE.test(origin);
}

export function corsHeaders(origin?: string | null) {
  const headers: Record<string,string> = {
    "Vary": "Origin",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,X-OK-PASS",
    "Access-Control-Max-Age": "86400"
  };
  if (origin && isAllowedOrigin(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}

export function preflight(event: any) {
  const origin = event.headers?.origin || event.headers?.Origin || null;
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders(origin), body: "" };
  }
  return null;
}

export const validateOrigin = (origin: string | null): boolean => {
  return isAllowedOrigin(origin);
};

export const setCorsHeaders = (origin: string | null): Record<string, string> => {
  return corsHeaders(origin || undefined);
};

export const handleCorsPrelight = (origin: string | null) => {
  return { statusCode: 204, headers: corsHeaders(origin || undefined), body: "" };
};
