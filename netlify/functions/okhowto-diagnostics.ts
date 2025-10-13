import type { Handler, HandlerEvent } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import { corsHeaders, preflight, isAllowedOrigin } from './utils/cors';

export const handler: Handler = async (event: HandlerEvent) => {
  const origin = event.headers.origin || null;

  if (event.httpMethod === 'OPTIONS') {
    return preflight(event);
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: corsHeaders(origin),
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const namespace = process.env.BLOBS_NAMESPACE || 'okhowto';
    let videosKeyExists = false;

    try {
      const store = getStore(namespace);
      const data = await store.get('videos.json', { type: 'text' });
      videosKeyExists = data !== null;
    } catch (blobError) {
      console.warn('[Diagnostics] Error checking blobs:', blobError);
      videosKeyExists = false;
    }

    const allowedOriginsEnv = process.env.ALLOWED_ORIGINS || '';
    const allowedOriginsCount = allowedOriginsEnv
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean).length;

    const allowed = !origin ? true : isAllowedOrigin(origin);
    const corsMode = !origin ? 'same-origin' : 'cors';

    const diagnostics = {
      ok: true,
      env: {
        BLOBS_NAMESPACE: !!process.env.BLOBS_NAMESPACE,
        CLOUDINARY_CLOUD_NAME: !!process.env.CLOUDINARY_CLOUD_NAME,
        CLOUDINARY_UPLOAD_PRESET: !!process.env.CLOUDINARY_UPLOAD_PRESET,
        CLOUDINARY_FOLDER: !!process.env.CLOUDINARY_FOLDER,
        OKH_PASS: process.env.OKH_PASS ? process.env.OKH_PASS.length >= 8 : false,
        ALLOWED_ORIGINS_count: allowedOriginsCount,
      },
      cors: {
        origin: origin || null,
        allowed,
        corsMode,
      },
      blobs: {
        namespace,
        videosKeyExists,
      },
      notes: 'No secret values are returned.',
    };

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders(origin),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(diagnostics, null, 2),
    };
  } catch (error) {
    console.error('[Diagnostics] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      statusCode: 500,
      headers: corsHeaders(origin),
      body: JSON.stringify({ error: 'Diagnostics check failed', details: errorMessage }),
    };
  }
};
