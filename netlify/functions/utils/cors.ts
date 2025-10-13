export const PREVIEW_RE = /^https:\/\/[a-z0-9-]+--onkliniclp\.netlify\.app$/i;

function parseOrigins(): string[] {
  const raw = process.env.ALLOWED_ORIGINS || "";
  return raw.split(",").map(s => s.trim()).filter(Boolean);
}

/** Same-origin (no Origin header) is allowed. */
export function isAllowedOrigin(origin?: string | null): boolean {
  if (!origin) return true; // same-origin
  const wl = parseOrigins();
  if (wl.includes(origin)) return true;
  return PREVIEW_RE.test(origin);
}

export function corsHeaders(origin?: string | null): Record<string, string> {
  const headers: Record<string, string> = {
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

export function preflight(req: Request): Response | null {
  const origin = req.headers.get("Origin");
  if (req.method === "OPTIONS") {
    return new Response("", { status: 204, headers: corsHeaders(origin) });
  }
  return null;
}
