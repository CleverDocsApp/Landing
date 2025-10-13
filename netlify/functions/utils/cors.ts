export const PREVIEW_RE = /^https:\/\/[a-z0-9-]+--onkliniclp\.netlify\.app$/i;

export const parseOrigins = (): string[] => {
  const envOrigins = process.env.ALLOWED_ORIGINS || '';
  const parsed = envOrigins
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const defaults = ['https://onklinic.com', 'https://www.onklinic.com'];

  return parsed.length > 0 ? parsed : defaults;
};

export const isAllowedOrigin = (origin: string | undefined): boolean => {
  if (!origin) {
    return false;
  }

  const allowedOrigins = parseOrigins();
  if (allowedOrigins.includes(origin)) {
    return true;
  }

  if (PREVIEW_RE.test(origin)) {
    return true;
  }

  if (origin.endsWith('.netlify.app')) {
    return true;
  }

  if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
    return true;
  }

  return false;
};

export const corsHeaders = (origin: string | undefined): Record<string, string> => {
  const headers: Record<string, string> = {
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-OK-PASS',
    'Access-Control-Max-Age': '86400',
  };

  if (origin && isAllowedOrigin(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  } else {
    headers['Access-Control-Allow-Origin'] = 'https://onkliniclp.netlify.app';
  }

  return headers;
};

export const preflight = (origin: string | undefined) => {
  return {
    statusCode: 204,
    headers: corsHeaders(origin),
    body: '',
  };
};

export const validateOrigin = (origin: string | null): boolean => {
  return isAllowedOrigin(origin || undefined);
};

export const setCorsHeaders = (origin: string | null): Record<string, string> => {
  return corsHeaders(origin || undefined);
};

export const handleCorsPrelight = (origin: string | null) => {
  return preflight(origin || undefined);
};
