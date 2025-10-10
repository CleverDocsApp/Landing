const ALLOWED_ORIGINS = [
  'https://onklinic.com',
  'https://www.onklinic.com',
];

export const validateOrigin = (origin: string | null): boolean => {
  if (!origin) return false;

  if (ALLOWED_ORIGINS.includes(origin)) {
    return true;
  }

  if (origin.endsWith('.netlify.app')) {
    return true;
  }

  return false;
};

export const setCorsHeaders = (origin: string | null): Record<string, string> => {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-OK-PASS',
    'Access-Control-Max-Age': '86400',
  };

  if (origin && validateOrigin(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }

  return headers;
};

export const handleCorsPrelight = (origin: string | null) => {
  if (!validateOrigin(origin)) {
    return new Response('Forbidden', {
      status: 403,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  return new Response(null, {
    status: 204,
    headers: setCorsHeaders(origin),
  });
};
