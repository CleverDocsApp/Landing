const ALLOWED_ORIGINS = [
  'https://onklinic.com',
  'https://www.onklinic.com',
];

export const validateOrigin = (origin: string | null): boolean => {
  if (!origin) {
    console.log('[CORS] No origin provided');
    return false;
  }

  if (ALLOWED_ORIGINS.includes(origin)) {
    console.log('[CORS] Origin allowed (exact match):', origin);
    return true;
  }

  if (origin.endsWith('.netlify.app')) {
    console.log('[CORS] Origin allowed (Netlify preview):', origin);
    return true;
  }

  if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
    console.log('[CORS] Origin allowed (localhost):', origin);
    return true;
  }

  console.log('[CORS] Origin rejected:', origin);
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
    return {
      statusCode: 403,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Forbidden: Invalid origin',
    };
  }

  return {
    statusCode: 204,
    headers: setCorsHeaders(origin),
    body: '',
  };
};
